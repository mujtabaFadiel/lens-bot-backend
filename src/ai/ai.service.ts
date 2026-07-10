import { forwardRef, Inject, Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { AvailabilityService } from 'src/availability/availability.service';
import { BookingService } from 'src/booking/booking.service';
import { CustomersService } from 'src/customers/customers.service';
import { PackagesService } from 'src/packages/packages.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageRole } from 'src/conversation/Entity/conversation';

@Injectable()
export class AiService {
    private groq: Groq
    constructor(
        private readonly packagesService: PackagesService,
        private readonly availabilityService: AvailabilityService,
        private readonly customersService: CustomersService,
        @Inject(forwardRef(() => BookingService))
        private readonly bookingService: BookingService,
        private readonly conversationService: ConversationService,
    ) {
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    }

    async handleMsg(phone: string, msg: string) {
        // 1. تنظيف الرقم من زوائد Twilio وعلامة الـ +
        let cleanPhone = phone.replace('whatsapp:', '').replace('+', '').trim();

        // 2. الفحص الذكي: إذا كان الرقم عُمانياً ومكتوباً بالصيغة الدولية، نحوله لمحلي (8 أرقام)
        if (cleanPhone.startsWith('968') && cleanPhone.length > 8) {
            cleanPhone = cleanPhone.substring(3); // يبقى الرقم المحلي العُماني فقط (مثل: 79919877)
        }
        // إذا كان من السعودية (966) أو السودان (249) أو غيرها، سيترك الكود الرقم بالكامل كما هو (مثل: 9665xxxxxxxx)

        console.log(`📱 الرقم المعتمد في قاعدة البيانات: ${cleanPhone}`);

        let customer;
        // ... بقية كود البحث والإنشاء والـ Groq كما هو دون تغيير ...
        try {
            // البحث الآن سيتم على '79919877' وسيتطابق تماماً مع هيكلة قاعدة البيانات لديك
            customer = await this.customersService.getCustomerByPhone(cleanPhone);

            if (!customer) {
                console.log(`👤 جاري تسجيل عميل جديد بالرقم المحلي: ${cleanPhone}`);
                customer = await this.customersService.createCustomer({
                    name: 'عميل جديد',
                    phone: cleanPhone
                });
            }
        } catch (customerError: any) {
            console.error('❌ فشل حرج في جلب أو إنشاء العميل:', customerError.message);
            // خط الأمان الرائع الذي حمى السيرفر
            customer = { id: 1, name: 'عميل واتساب', phone: cleanPhone };
        }

        // تأكد من استخدام cleanPhone في بقية الدالة (المحادثات، السجل، إلخ...)
        await this.conversationService.saveMessage(cleanPhone, MessageRole.USER, msg);
        const history = await this.conversationService.getRecentHistory(cleanPhone, 10) || [];

        // ... بقية كود الـ Groq والـ Prompt والحفظ ...
        const getPackages: any = await this.packagesService.getPackages();
        const availableDates = await this.availabilityService.getAvailableDates();

        // بناء الـ System Prompt وحساب الـ State ديناميكياً من السجل الحالي والعميل
        const state = this.deriveStateFromHistory(history, customer, getPackages, availableDates);
        const systemPrompt: any = this.buildSystemPrompt(getPackages, availableDates, state);

        //  حوّل الـ history لشكل messages
        const conversationMessages = Array.isArray(history)
            ? history.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
            }))
            : []

        const completion = await this.groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationMessages, //  كل السياق
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = completion.choices[0]?.message?.content || 'عذراً، لم أفهم سؤالك.';

        //  احفظ رد البوت
        await this.conversationService.saveMessage(phone, MessageRole.ASSISTANT, reply);

        const parsedDate = state.bookingDate && state.bookingDate !== '❌ لم يُحدد بعد'
            ? new Date(state.bookingDate)
            : new Date();

        // 🎯 الفحص: إذا أرسل البوت رسالة الاستلام النهائية، نلتقط الحجز فوراً للمصور
        // 🎯 الفحص: إذا أرسل البوت رسالة الاستلام النهائية
        if (reply.includes("تم استلام طلب حجزك") || reply.includes("استلام طلب حجزك")) {
            try {
                const botPackageText = state.packageName.toLowerCase().trim();

                // 1. البحث الذكي والمرن في كلا الحقلين (name و type) لتجنب الـ undefined
                let selectedPackage = getPackages.find((p: any) => {
                    const dbName = p.name ? p.name.toLowerCase().trim() : '';
                    const dbType = p.type ? p.type.toLowerCase().trim() : '';

                    // التحقق مما إذا كان النص الملتقط يحتوي على اسم الباقة أو نوعها، أو العكس
                    return (
                        dbName.includes(botPackageText) ||
                        botPackageText.includes(dbName) ||
                        dbType.includes(botPackageText) ||
                        botPackageText.includes(dbType)
                    );
                });

                // 2. خط أمان احتياطي: إذا لم يجد تطابقاً نصياً، نختار أول باقة في قاعدة البيانات بدلاً من انهيار السيرفر
                if (!selectedPackage && getPackages.length > 0) {
                    selectedPackage = getPackages[0];
                }

                // 3. تحويل التاريخ إلى كائن Date
                const parsedDate = state.bookingDate && state.bookingDate !== '❌ لم يُحدد بعد'
                    ? new Date(state.bookingDate)
                    : new Date();

                // 4. تنفيذ الحجز بعد ضمان وجود جميع البيانات والكائنات المعرّفة
                if (customer && customer.id && selectedPackage) {
                    await this.bookingService.createBooking({
                        customerId: customer.id,
                        packageId: selectedPackage.id, // 👈 مضمونة الوجود الآن بنسبة 100%
                        date: parsedDate,
                        notes: `حجز تلقائي عبر الواتساب - باقة ${state.packageName}`
                    });
                    console.log(`✨ تم التقاط الحجز بنجاح وحفظه في السيرفر للعميل: ${customer.name}`);
                } else {
                    console.error('تنبيه: لم يتم حفظ الحجز بسبب نقص في الكائنات الأساسية (customer أو selectedPackage).');
                }

            } catch (bookingError: any) {
                console.error('فشل حفظ الحجز من خلال BookingService:', bookingError.message);
            }
        }

        return reply;
    }

    // دالة مساعدة لاستخراج الحالة الحالية من سياق الحوار والنصوص المتبادلة
    private deriveStateFromHistory(history: any[], customer: any, packages: any[], dates: any[]) {
        const customerName = customer && customer.name !== 'عميل جديد' ? customer.name : '❌ لم يُذكر بعد';

        let packageName = '❌ لم تُختر بعد';
        let bookingDate = '❌ لم يُحدد بعد';

        // دمج نصوص المحادثة الأخيرة لفحصها
        const historyText = history.map(h => h.content).join(' ').toLowerCase();

        // فحص الباقات
        for (const p of packages) {
            if (historyText.includes(p.name.toLowerCase())) {
                packageName = p.name;
                break;
            }
        }

        // فحص التواريخ المتاحة
        for (const d of dates) {
            if (historyText.includes(d.date)) {
                bookingDate = d.date;
                break;
            }
        }

        return {
            customerName,
            packageName,
            bookingDate
        };
    }

    private buildSystemPrompt(packages: any[], dates: any[], state?: any) {
        const packagesText = packages
            .map(p => `- ${p.name} (${p.type}): ${p.price} ريال، ${p.duration}، يشمل: ${p.features?.join('، ')}`)
            .join('\n');

        const datesText = dates.slice(0, 5).map(d => `${d.date}`).join('، ');

        const collectedInfo = state ? `
معلومات العميل المجموعة حتى الآن:
- الاسم: ${state.customerName}
- الباقة: ${state.packageName !== '❌ لم تُختر بعد' ? `✅ (${state.packageName})` : '❌ لم تُختر بعد'}
- التاريخ: ${state.bookingDate !== '❌ لم يُحدد بعد' ? `✅ (${state.bookingDate})` : '❌ لم يُحدد بعد'}
        ` : '';

        return `
# هويتك
أنت "لينا" - مساعدة ذكية لـ Aura Studio.
شخصيتك: ودودة، محترفة، مختصرة، وتهتم براحة العميل.

# باقاتنا
${packagesText}

# المواعيد المتاحة
${datesText}

${collectedInfo}

# كيف تتصرفين

## عند الترحيب
- رحّبي بحرارة وعرّفي نفسك باختصار
- اسألي كيف تقدرين تساعدين

## عند السؤال عن الأسعار
- اعرضي الباقات بشكل واضح ومنظم
- اذكري ما تشمله كل باقة
- اقترحي الباقة المناسبة حسب احتياج العميل
- أنتِ في منتصف محادثة، لا تبدأي من البداية
- تصرفي بناءً على آخر رسالة فقط
- لو اكتمل الحجز مسبقاً، لا تعيدي العملية

## عند طلب الحجز
اجمعي هذه المعلومات بالترتيب (لا تطلبي أكثر من معلومة واحدة في كل رسالة):
1. الاسم الكامل
2. الباقة المطلوبة
3. التاريخ المناسب من المواعيد المتاحة

## عند اكتمال المعلومات
أرسلي هذا الرد بالضبط دون أي زيادة أو نقصان:
"تم استلام طلب حجزك 

 الاسم: [الاسم]
 الباقة: [اسم الباقة]
 التاريخ: [التاريخ]

سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الحجز 🎯"

# قواعد مهمة
- ❌ لا تطلبي معلومة ذُكرت مسبقاً
- ❌ لا تقولي "تم الحجز" أو "تم التأكيد" (فقط "تم استلام الطلب")
- ✅ جاوبي بنفس لغة العميل (عربي أو إنجليزي)
- ✅ ردودك قصيرة ومباشرة (لا تزيد عن 5 أسطر عادةً)
- ✅ لو العميل غاضب أو متضايق، تعاملي بتفهم وصبر

# أمثلة على الردود الجيدة
العميل: "كم سعر تصوير الزواج؟"
لينا: "عندنا باقتان للزفاف 
- ذهبية: 60 ريال (8 ساعات + 200 صورة + فيديو)
- فضية: 40 ريال (4 ساعات + 100 صورة)
أيهما يناسبك؟"

العميل: "هل يوم الجمعة متاح؟"
لينا: "المواعيد المتاحة حالياً:
${datesText}
هل تود الحجز في أحد هذه المواعيد؟ "
    `;
    }
}