import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './Entity/customers';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CustomersDto } from './Dto/customers.dto';
import { UpdateCustomerDto } from './Dto/UpdateCustomer.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>
    ) { }

    async createCustomer(dto: CustomersDto) {
        const existCustomer = await this.customerRepo.findOneBy({ phone: dto.phone })

        if (existCustomer)
            throw new ConflictException(`customer with number ${dto.phone} already exist`);

        const customer = await this.customerRepo.create({
            name: dto.name,
            phone: dto.phone
        })

        return await this.customerRepo.save(customer);
    }

    async updateCustomer(id: number, dto: UpdateCustomerDto) {
        const existCustomer = await this.customerRepo.findOneBy({ id })
        if (!existCustomer) throw new NotFoundException(`Customer ${id} not found!`);

        await this.customerRepo.update(id, dto)

        return { message: 'Package updated successfully' };
    }

    async getNewCustomers() {
        const oneDayAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        const newCustomersCount = await this.customerRepo.count({
            where: { createdAt: MoreThanOrEqual(oneDayAgo) }
        })

        return { newCustomers: newCustomersCount }
    }

    async getCustomer() {
        return this.customerRepo.find()
    }

    async getCustomerById(id: number) {
        const customer = await this.customerRepo.findOneBy({ id });
        console.log(customer)
        if (!customer) throw new NotFoundException(`Customer with id: ${id} not found!`);
        return customer;
    }

    // ✅ التعديل الصحيح داخل customers.service.ts
    async getCustomerByPhone(phone: string) {
        // نكتفي بالبحث والإرجاع المباشر دون عمل throw new NotFoundException
        return await this.customerRepo.findOneBy({ phone });
    }

    async deleteCustomer(id: number) {
        const existCustomer = await this.customerRepo.findOneBy({ id })
        if (!existCustomer) throw new NotFoundException(`Customer ${id} not found!`);

        await this.customerRepo.softDelete(id)

        return { message: "Customer deleted successfully" };
    }

    async resoreCustomer(id: number) {
        await this.customerRepo.restore(id)

        return { message: 'Customer restored successfully' };
    }
}
