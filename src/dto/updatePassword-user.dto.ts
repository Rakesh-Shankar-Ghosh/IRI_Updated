// updatePassword-user.dto.ts

import { IsNotEmpty, MinLength } from 'class-validator';
export class UpdatePasswordUserDto {
  @IsNotEmpty({ message: 'Old Password field not be empty' })
  oldPassword?: string;
  
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'password field is not be empty' })
  password?: string;

  @IsNotEmpty({ message: 'ConfirmPassword field must not be empty' })
  confirmPassword?: string;

}
