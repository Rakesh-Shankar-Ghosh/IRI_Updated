// update-user.dto.ts

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  name?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;



  @IsNotEmpty({ message: 'Country should not be empty' })
  country?: string;

  @IsNotEmpty({ message: 'Profession should not be empty' })
  profession?: string;

}
