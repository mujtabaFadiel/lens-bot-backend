// whatsapp/whatsapp.service.ts
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio'; // ✅ import مباشر للـ class

@Injectable()
export class WhatsappService {
    private client: Twilio;

    constructor() {
        this.client = new Twilio( // ✅ استخدم new
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN,
        );
    }

    async sendMessage(to: string, body: string) {
        return await this.client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
            body,
        });
    }
}