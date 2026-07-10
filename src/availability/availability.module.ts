import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './Entity/availability.entity';

@Module({
  providers: [AvailabilityService],
  controllers: [AvailabilityController],
  imports: [TypeOrmModule.forFeature([Availability])],
  exports: [AvailabilityService]
})
export class AvailabilityModule { }
