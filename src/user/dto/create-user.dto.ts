/* eslint-disable prettier/prettier */
import { IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, {
    message:
      'Name can contain only letters and single spaces between words. No leading/trailing/multiple spaces.',
  })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Invalid email format and no spaces allowed',
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{6,}$/, {
    message:
      'Password must be at least 6 characters and include uppercase, lowercase, number, special character. No spaces allowed.',
  })
  password: string;
}
