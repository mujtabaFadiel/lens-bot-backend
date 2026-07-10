import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AvailabilityStatus } from '../Entity/availability.entity';

export class CreateAvailabilityDto {
    @Type(() => Date)
    @IsDate()
    date!: Date;

    @IsOptional()
    @IsEnum(AvailabilityStatus)
    status?: AvailabilityStatus;

    @IsOptional()
    startTime?: string; // ← "09:00"

    @IsOptional()
    endTime?: string; // ← "12:00"

    @IsOptional()
    @IsString()
    notes?: string;
}