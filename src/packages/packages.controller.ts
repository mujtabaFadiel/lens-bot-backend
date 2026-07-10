import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './Dto/package.dto';
import { UpdatePackageDto } from './Dto/update-package.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('packages')
@UseGuards(JwtAuthGuard)
export class PackagesController {
    constructor(
        private packageService: PackagesService
    ) { }

    @Post()
    async createPackage(@Body() dto: CreatePackageDto) {
        return await this.packageService.createPackage(dto)
    }

    @Patch(':id')
    async updatePackage(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePackageDto
    ) {
        return await this.packageService.updatePackage(id, dto);
    }

    @Get()
    async getPackages(
        @Query('type') type: string,
        @Query('isActive') isActive: string
    ) {
        return await this.packageService.getPackages(type, isActive)
    }

    @Get(':id')
    async getPackageById(@Param('id') id: number) {
        return await this.packageService.getPackageById(id)
    }

    @Delete(':id')
    async deletePackage(@Param('id') id: number) {
        return await this.packageService.deletePackage(id)
    }
}
