/* eslint-disable prettier/prettier */
import { IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name can contain only letters and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Invalid email format',
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
    },
  )
  password: string;
}
