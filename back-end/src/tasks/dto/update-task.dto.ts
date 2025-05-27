import { IsString, IsDateString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DescriptionDto {
  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  acceptanceCriteria?: string[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsDateString()
  @IsOptional()
  duedate?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => DescriptionDto)
  description?: DescriptionDto;
}