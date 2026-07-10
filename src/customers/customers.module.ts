import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './Entity/customers';

@Module({
  providers: [CustomersService],
  controllers: [CustomersController],
  imports: [TypeOrmModule.forFeature([Customer])],
  exports: [CustomersService]
})
export class CustomersModule {}
