import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('conversation')
export class ConversationController {
    constructor(readonly conversation: ConversationService) {}

    @Get()
    async getTotalMessagesCount() {
        return await this.conversation.getTotalMessagesCount()
    }
    @Get('/msgs')
    async getMsgs() {
        return await this.conversation.getMsgs()
    }
}
