import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './Entity/booking.entity';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateBookingDto } from './Dto/booking.dto';
import { CustomersService } from 'src/customers/customers.service';
import { PackagesService } from 'src/packages/packages.service';
import { UpdateStatusDto } from './Dto/updateBooking.dto';
import { WhatsappService } from 'src/whats-app/whats-app.service';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
        private readonly customerService: CustomersService,
        private readonly PackageService: PackagesService,
        private readonly whatsAppService: WhatsappService
    ) { }

    async createBooking(dto: CreateBookingDto) { //العميل يحجز

        const customer = await this.customerService.getCustomerById(dto.customerId)
        const pack = await this.PackageService.getPackageById(dto.packageId)

        const Booking = await this.bookingRepo.create({
            customer,
            package: pack,
            date: dto.date,
            notes: dto.notes
        })

        return await this.bookingRepo.save(Booking)
    }

    async getBookings() {// المصور يشوف الحجوزات
        const bookings = await this.bookingRepo.find({
            relations: {
                customer: true,
                package: true,
                user: true
            }
        })

        const numOfBookings = await this.bookingRepo.count()

        return { bookings, numOfBookings }
    }

    async mostRequestedServices() {
        const packagesList = await this.bookingRepo.query(`
    SELECT 
        p.id AS "packageId",
        p.type AS "packageName",
        COUNT(b.id) AS "totalOrders"
    FROM public."package" p
    LEFT JOIN public."Bookings" b ON p.id = b."packageId"
    GROUP BY p.id, p.name
    ORDER BY "totalOrders" DESC
  `);

        // نعيد المصفوفة كاملة لتتمكن من عمل map عليها في الموقع
        return {
            mostPackages: packagesList
        };
    }

    async getMonthlyRevenue() {
        const rawData = await this.bookingRepo.query(`
    SELECT 
        TO_CHAR(b.date, 'YYYY-MM') AS "month",
        SUM(p.price) AS "totalRevenue"
    FROM public."Bookings" b
    INNER JOIN public."package" p ON b."packageId" = p.id
    WHERE b.status = 'completed'
    GROUP BY TO_CHAR(b.date, 'YYYY-MM')
    ORDER BY "month" ASC
  `);

        // تحويل البيانات لشكل مصفوفتين منفصلتين ليسهل استهلاكهم في التشارت مباشرة
        const labels = rawData.map((item: any) => item.month);
        const data = rawData.map((item: any) => parseFloat(item.totalRevenue || '0'));

        return { data, labels };
    }

    async upcomingBookings() {
        const bookings = await this.bookingRepo.find({
            where: {
                date: MoreThanOrEqual(new Date()),

                status: In(['confirmed', 'pending']) // ignore completed or canceled
            },
            relations: {
                customer: true,
                package: true,
            },
            order: {
                date: "ASC"
            },
            take: 4
        })
        return bookings;
    }

    async getDashboardStats() {
        const allBookings = await this.bookingRepo.find({
            relations: { package: true }
        })

        const completedBookings = allBookings
            .filter((b => b.status === BookingStatus.COMPLETED)).length
        const confirmedBookings = allBookings
            .filter((b => b.status === BookingStatus.CONFIRMED)).length
        const pendingBookings = allBookings
            .filter((b => b.status === BookingStatus.PENDING)).length
        const canceledBookings = allBookings
            .filter((b => b.status === BookingStatus.CANCELLED)).length

        return {
            bookingStatus: [
                { completed: completedBookings },
                { confirmed: confirmedBookings },
                { cancelled: canceledBookings },
                { pending: pendingBookings },
            ]
        }
    }

    async getBookingById(id: number) {
        return await this.bookingRepo.findOne({
            where: { id },
            relations: {
                customer: true,
                package: true,
            }
        })
    }

    async getCustomerBookings(customerId: number) {//حجوزات عميل معين
        return await this.bookingRepo.find({
            where: {
                customer: { id: customerId },
            },
            relations: {
                customer: true, package: true
            }
        })
    }

    async getCompletedBookings() {
        const completed = await this.bookingRepo.find({
            where: { status: BookingStatus.COMPLETED },
            relations: {
                customer: true, package: true, user: true
            }
        })

        if (completed.length === 0)
            throw new NotFoundException('No completed bookings found');

        const totalRevenue = completed.map(price => price.package.price)

        return {
            completed,
            totalRevenue: totalRevenue.reduce((sum, current) => sum + current + 0)
        };
    }

    async BookingStatus(id: number, dto: UpdateStatusDto) { 
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: { customer: true }
        });

        if (!booking) {
            throw new NotFoundException(`no booking with the given id: ${id}`);
        }

        // 2. تحديث حالة الحجز في قاعدة البيانات
        await this.bookingRepo.update(id, { status: dto.status });

        // 3. التحقق من حالة القبول، والتأكد من أن كائن العميل ورقم هاتفه متوفران
        if (dto.status === 'confirmed') {
            if (booking.customer && booking.customer.phone) {

                let recipientPhone = booking.customer.phone.trim();

                // 🎯 إعادة تركيب الرقم بالصيغة الدولية الصحيحة حسب طوله
                if (recipientPhone.length === 8) {
                    // الرقم عُماني محلي، نضيف له مفتاح عُمان الدولي
                    recipientPhone = `+968${recipientPhone}`;
                } else if (!recipientPhone.startsWith('+')) {
                    // الرقم دولي كامل (سعودي، سوداني، إلخ) ومخزن بدون +، فقط نضيف له الـ +
                    recipientPhone = `+${recipientPhone}`;
                }

                console.log(`📱 جاري الإرسال عبر Twilio للصيغة الدولية: ${recipientPhone}`);

                const confirm = await this.whatsAppService.sendMessage(
                    recipientPhone,
                    'تمت الموافقة على حجزك ✅'
                );

                return { confirm, message: 'update completed and client notified' };
            }
        } if (dto.status === 'confirmed') {
            if (booking.customer && booking.customer.phone) {
                const confirm = await this.whatsAppService.sendMessage(
                    booking.customer.phone,
                    'تمت الموافقة على حجزك ✅'
                );
                return {
                    confirm,
                    message: 'update completed and client notified'
                };
            } else {
                console.warn(`⚠️ تم قبول الحجز رقم ${id} ولكن لم يتم إرسال رسالة واتساب لعدم وجود رقم هاتف مرتبط بالعميل.`);
            }
        }

        return { message: 'update completed' };
    }

    async deleteBooking(id: number) {
        const booking = await this.bookingRepo.delete(id)
        if (!booking) throw new NotFoundException(`no booking with the given id: ${id}`);
        return { message: 'booking deleted successfully!' }
    }
}
