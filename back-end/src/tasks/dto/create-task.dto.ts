import { IsString, IsDateString, IsNotEmpty, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DescriptionDto {
  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsArray()
  @IsString({ each: true })
  acceptanceCriteria: string[];

  @IsString()
  notes: string;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsDateString()
  @IsNotEmpty()
  duedate: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DescriptionDto)
  description: DescriptionDto;
}