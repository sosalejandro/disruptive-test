import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignCategoriesDto {
  @IsArray({
    message: 'CategoryIds must be an array',
  })
  @IsNotEmpty({
    each: true,
    message: 'CategoryIds cannot be empty',
  })
  @IsString({
    each: true,
    message: 'Each categoryId must be a string',
  })
  categoryIds: string[];
}