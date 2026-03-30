import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePageDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  title?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  businessType: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/)
  whatsapp: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
