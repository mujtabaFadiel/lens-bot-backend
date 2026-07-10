import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './Entity/Package';
import { Repository } from 'typeorm';
import { CreatePackageDto } from './Dto/package.dto';
import { UpdatePackageDto } from './Dto/update-package.dto';

@Injectable()
export class PackagesService {
    constructor(
        @InjectRepository(Package)
        private readonly packageRepo: Repository<Package>,
    ) { }

    async createPackage(dto: CreatePackageDto) {
        const createPackage = await this.packageRepo.create({
            name: dto.name,
            price: dto.price,
            description: dto.description,
            duration: dto.duration,
            deliveryDays: dto.deliveryDays,
            type: dto.type,
            features: dto.features
        })
        return await this.packageRepo.save(createPackage)
    }


    async updatePackage(id: number, dto: UpdatePackageDto) {
        const result = await this.packageRepo.update(id, dto);

        //  التحقق مما إذا كانت هناك صفوف تأثرت بالتعديل (affected)
        if (result.affected === 0) {
            throw new NotFoundException(`Package with ID ${id} not found!`);
        }

        return { message: 'Package updated successfully' };
    }


    async getPackages(type?: string, isActive?: string) {
    
    if (!type && !isActive) {
        return await this.packageRepo.find();
    }

    if (type && isActive) {
        return await this.packageRepo.find({
            where: { 
                type: type,
                isActive: isActive === 'true'
            }
        });
    }

    if (type) {
        return await this.packageRepo.find({
            where: { type: type }
        });
    }

    if (isActive) {
        return await this.packageRepo.find({
            where: { isActive: isActive === 'true' }
        });
    }
}

    async getPackageById(id: number) {
        const thePackage = await this.packageRepo.findOneBy({ id })
        if (!thePackage) throw new NotFoundException(`Package with ID ${id} not found!`);

        return thePackage;
    }

    async deletePackage(id: number) {
        const thePackage = await this.packageRepo.findOneBy({ id })
        if (!thePackage) throw new NotFoundException(`Package with ID ${id} not found!`);

        return await this.packageRepo.remove(thePackage)
    }
}
