import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './Dto/booking.dto';
import { UpdateStatusDto } from './Dto/updateBooking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
    ) { }

    @Post()
    async createBooking(@Body() dto: CreateBookingDto) {
        return await this.bookingService.createBooking(dto)
    }

    
    @Get('/completed')
    async getCompletedBookings(){
        return await this.bookingService.getCompletedBookings()
    }

    @Get('/dashboardStats')
    async getDashboardStats() {
        return await this.bookingService.getDashboardStats()
    }


    @Get ('/most')
    async mostRequestedServices () {
        return await this.bookingService.mostRequestedServices()
    }

    @Get('/per-month')
    async getMonthlyRevenue() {
        return await this.bookingService.getMonthlyRevenue()
    }

    @Get('/upcoming')
    async upcomingBookings() {
        return await this.bookingService.upcomingBookings()
    }

    @Get()
    async getBookings() {
        return await this.bookingService.getBookings()
    }

    @Get(':id')
    async getBookingById(@Param('id', ParseIntPipe) id: number) {
        return await this.bookingService.getBookingById(id)
    }

    @Get('/customer/:id')
    async getCustomerBookings(@Param('id', ParseIntPipe) id: number) {
        return await this.bookingService.getCustomerBookings(id)
    }

    @Patch('/:id/status')
    async BookingStatus(
        @Body() dto: UpdateStatusDto,
        @Param('id', ParseIntPipe) id: number) {
        return await this.bookingService.BookingStatus(id, dto)
    }

    @Delete(':id')
    async DeleteBooking(@Param('id', ParseIntPipe) id: number){
        return await this.bookingService.deleteBooking(id)
    }
}
