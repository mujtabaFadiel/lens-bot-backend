// packages/dto/create-package.dto.ts
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePackageDto {
  @ApiProperty({ example: 'باقة ذهبية' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'WEDDING' })
  @IsString()
  type!: string;

  @ApiProperty({ example: 'باقة زواج شاملة مع فيديو احترافي' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: '8 ساعات' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: 14 })
  @IsOptional()
  @IsNumber()
  deliveryDays?: number;

  @ApiPropertyOptional({ example: ['200 صورة معدلة', 'فيديو 5 دقائق'] })
  @IsOptional()
  @IsArray()
  features?: string[];
}