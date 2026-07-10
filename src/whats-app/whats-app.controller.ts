// whatsapp/whatsapp.controller.ts
import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AiService } from 'src/ai/ai.service';
import { WhatsappService } from './whats-app.service';

@Controller('whatsapp')
export class WhatsappController {
    constructor(
        private readonly aiService: AiService,
        private readonly whatsappService: WhatsappService,
    ) { }

    @Post('webhook')
    async receiveMessage(@Req() req: Request, @Res() res: Response) {
        const rawFrom = req.body.From || ''; // مثلاً "whatsapp: 96879919877"

        // 1. تنظيف الرقم: إزالة "whatsapp:"، وإزالة كل المسافات الفارغة تماماً
        let phone = rawFrom.replace('whatsapp:', '').replace(/\s+/g, '').trim();

        // 2. التأكد من وجود علامة الـ + الدولية في بداية الرقم
        if (!phone.startsWith('+')) {
            phone = `+${phone}`;
        }

        // 3. إعادة بناء المعرف الكامل لـ Twilio بشكل صحيح وبدون مسافات
        const twilioFormattedTo = `whatsapp:${phone}`;

        console.log(`📩 رسالة نظيفة من ${phone} (Twilio ID: ${twilioFormattedTo}): ${req.body.Body}`);

        try {
            // نمرر الرقم النظيف فقط للـ AI والـ Database
            const reply = await this.aiService.handleMsg(phone, req.body.Body);

            // نرسل لـ Twilio المعرف القياسي الخالي من المسافات
            await this.whatsappService.sendMessage(twilioFormattedTo, reply);
        } catch (error) {
            console.error('Error:', error);
            await this.whatsappService.sendMessage(twilioFormattedTo, 'عذراً، حدث خطأ.');
        }

        res.set('Content-Type', 'text/xml');
        res.send('<Response></Response>');
    }
}