// conversation/conversation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, MessageRole } from './Entity/conversation';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepo: Repository<Conversation>
    ) { }

    // حفظ رسالة جديدة
    async saveMessage(phone: string, role: MessageRole, content: string) {
        const message = this.conversationRepo.create({ phone, role, content });
        return await this.conversationRepo.save(message);
    }

    async getTotalMessagesCount() {
        const count = await this.conversationRepo.count({
            where: { role: MessageRole.USER }
        })

        return { totalMessages: count }
    }

    async getMsgs() {
        const msgs = await this.conversationRepo.find({
            where: { role: MessageRole.USER },
            take: 4,
            order: {
                createdAt: 'DESC'
            }
        })
        return msgs
    }

    // جيب آخر 10 رسائل لهذا العميل (للسياق)
    async getRecentHistory(phone: string, limit = 10) {
        const messages = await this.conversationRepo.find({
            where: { phone },
            order: { createdAt: 'DESC' },
            take: limit,
        });

        if (!messages || messages.length === 0) {
            return [];
        }
        // نرجعها بالترتيب الصحيح (الأقدم أول)
        return messages.reverse();
    }

    // مسح محادثة عميل (بعد إتمام الحجز مثلاً)
    async clearHistory(phone: string) {
        await this.conversationRepo.delete({ phone });
    }
}