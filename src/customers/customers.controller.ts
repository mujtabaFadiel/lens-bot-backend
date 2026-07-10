import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersDto } from './Dto/customers.dto';
import { UpdateCustomerDto } from './Dto/UpdateCustomer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
    constructor(private readonly customerService: CustomersService) { }

    @Post()
    async createCustomer(@Body() dto: CustomersDto) {
        return await this.customerService.createCustomer(dto)
    }

    @Patch(':id')
    async updateCustomer(
        @Body() dto: UpdateCustomerDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.customerService.updateCustomer(id, dto)
    }

    @Get('new') 
    async getNewCustomers() {
        return await this.customerService.getNewCustomers()
    }
    @Get()
    async getCustomers() {
        return await this.customerService.getCustomer()
    }

    @Get(':id')
    async getCustomerById(@Param('id', ParseIntPipe) id: number) {
        return await this.customerService.getCustomerById(id)
    }

    @Get('phone/:phone')
    async getCustomerByPhone(@Param('phone') phone: string) {
        return await this.customerService.getCustomerByPhone(phone)
    }

    @Delete(':id')
    async deleteCustomer(@Param('id', ParseIntPipe) id: number) {
        return await this.customerService.deleteCustomer(id)
    }

    @Patch(':id/restore')
    async restoreCustomer(@Param('id', ParseIntPipe) id: number) {
        return await this.customerService.resoreCustomer(id)
    }
}
