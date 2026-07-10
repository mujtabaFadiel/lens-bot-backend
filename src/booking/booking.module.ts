import { forwardRef, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './Entity/booking.entity';
import { CustomersModule } from 'src/customers/customers.module';
import { PackagesModule } from 'src/packages/packages.module';
import { AuthModule } from 'src/auth/auth.module';
import { WhatsAppModule } from 'src/whats-app/whats-app.module';

@Module({
  providers: [BookingService],
  controllers: [BookingController],
  imports: [
    TypeOrmModule.forFeature([Booking]),
    CustomersModule, 
    PackagesModule,
    AuthModule, 
    forwardRef(() => WhatsAppModule)
  ],
  exports: [BookingService]
})
export class BookingModule {}
