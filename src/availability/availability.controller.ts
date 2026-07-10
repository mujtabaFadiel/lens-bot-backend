// availability/availability.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './Dto/avilability.dto';

@Controller('availability')
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) {}

    // المصور يضيف يوم
    @Post()
    async addDate(@Body() dto: CreateAvailabilityDto) {
        return await this.availabilityService.addDate(dto);
    }

    // كل المواعيد
    @Get()
    async getDates() {
        return await this.availabilityService.getDates();
    }

    // المواعيد المتاحة فقط
    @Get('available')
    async getAvailableDates() {
        return await this.availabilityService.getAvailableDates();
    }

    // تحقق من يوم معين
    @Get('check/:date')
    async checkDate(@Param('date') date: string) {
        return await this.availabilityService.checkDate(new Date(date));
    }
}