import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { BookingModule } from 'src/booking/booking.module';
import { CustomersModule } from 'src/customers/customers.module';
import { AvailabilityModule } from 'src/availability/availability.module';
import { PackagesModule } from 'src/packages/packages.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [PackagesModule, 
    AvailabilityModule, 
    CustomersModule, 
    forwardRef(() => BookingModule),
    ConversationModule
  ],
  providers: [AiService],
  exports: [AiService]
})
export class AiModule {}
