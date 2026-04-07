import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePageDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  title?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  heroHeadline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  heroSubheadline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  ctaText?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(MODERN|MINIMALIST|TECH)$/)
  layoutStyle?: 'MODERN' | 'MINIMALIST' | 'TECH';

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  primaryColor?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  businessType!: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/)
  whatsapp!: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
