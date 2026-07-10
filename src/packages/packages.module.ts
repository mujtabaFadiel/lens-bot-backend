import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './Entity/Package';

@Module({
  providers: [PackagesService],
  controllers: [PackagesController],
  imports: [TypeOrmModule.forFeature([Package])],
  exports: [PackagesService]
})
export class PackagesModule {}
