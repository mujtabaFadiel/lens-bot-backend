// booking/dto/create-booking.dto.ts
import { IsNumber, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  customerId!: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  packageId!: number;

  @ApiProperty({ example: '2026-07-10' })
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @ApiPropertyOptional({ example: 'الزواج في قاعة الماسة' })
  @IsOptional()
  @IsString()
  notes?: string;
}