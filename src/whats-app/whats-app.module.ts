import { forwardRef, Module } from '@nestjs/common';
import { WhatsappController } from './whats-app.controller';
import { WhatsappService } from './whats-app.service';
import { AiModule } from 'src/ai/ai.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [AiModule, forwardRef(() => BookingModule)],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService]

})
export class WhatsAppModule {}
