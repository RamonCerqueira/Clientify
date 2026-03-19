import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePageDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  businessType: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/)
  whatsapp: string;
}
