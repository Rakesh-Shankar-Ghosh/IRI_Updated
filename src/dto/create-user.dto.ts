// create-user.dto.ts

import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Country should not be empty' })
  country: string;

  @IsNotEmpty({ message: 'Profession should not be empty' })
  profession: string;
}
