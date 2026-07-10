import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability, AvailabilityStatus } from './Entity/availability.entity';
import { CreateAvailabilityDto } from './Dto/avilability.dto';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectRepository(Availability)
        private readonly availabilityRepo: Repository<Availability>,
    ) { }


    // المصور يضيف يوم متاح
    async addDate(dto: CreateAvailabilityDto) {
        // تحقق من تعارض الوقت في نفس اليوم
        const conflict = await this.availabilityRepo
            .createQueryBuilder('a')
            .where('a.date = :date', { date: dto.date })
            .andWhere('a.startTime < :endTime', { endTime: dto.endTime })
            .andWhere('a.endTime > :startTime', { startTime: dto.startTime })
            .getOne();

        if (conflict) throw new ConflictException(
            `يوجد تعارض في الوقت ${dto.startTime} - ${dto.endTime}`
        );

        const availability = await this.availabilityRepo.create(dto)
        return await this.availabilityRepo.save(availability)
    }

    async getDates() {
        return await this.availabilityRepo.find({
            order: { date: 'ASC' }
        });
    }

    // جيب المواعيد المتاحة فقط
    async getAvailableDates() {
        return await this.availabilityRepo.find({
            where: { status: AvailabilityStatus.AVAILABLE },
            order: { date: 'ASC' }
        })
    }

    // تحقق من يوم معين - البوت يستخدمه
    async checkDate(date: Date) {
        const avilability = await this.availabilityRepo.findOneBy({ date })

        if (!avilability) {
            return {
                date,
                status: 'not_set',
                message: 'This date is not specified by the photographer'
            }
        }

        return {
            date,
            status: avilability.status,
            message: avilability.status === AvailabilityStatus.AVAILABLE ?
                "Avilable" : "Booked"
        }
    }


    // عند قبول الحجز - يتغير تلقائياً لمحجوز
    async markAsBooked(date: Date, notes?: string) {
        const availability = await this.availabilityRepo.findOneBy({ date });
        if (!availability) throw new NotFoundException(`Date not found`);

        availability.status = AvailabilityStatus.BOOKED;
        if (notes) availability.notes = notes;

        return await this.availabilityRepo.save(availability);
    }
}
