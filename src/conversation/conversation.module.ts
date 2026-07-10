import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './Entity/conversation';
import { ConversationController } from './conversation.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]),
  AuthModule
],
  providers: [ConversationService],
  exports: [ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule { }
