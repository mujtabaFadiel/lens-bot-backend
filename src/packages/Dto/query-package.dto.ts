// packages/dto/query-package.dto.ts
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryPackageDto {
  @IsOptional()
  type?: string;
  // GET /packages?type=wedding 

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
  // GET /packages?isActive=true 
}