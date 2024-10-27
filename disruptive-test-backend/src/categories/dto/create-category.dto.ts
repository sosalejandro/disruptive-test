import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '@/enums';


export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Videos',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The type of the category',
    example: 'IMAGE',
    enum: ContentType,
  })
  @IsEnum(ContentType)
  @IsNotEmpty()
  type: ContentType;

  @ApiPropertyOptional({
    description: 'The URL of the cover image for the category',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  coverImage?: string;
}