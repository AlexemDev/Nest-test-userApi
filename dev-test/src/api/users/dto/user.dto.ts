import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, IsOptional, Length, MaxLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', '', {
    message: 'Email validation failed',
  })
  @ApiProperty({ example: 'test@gmail.com', description: 'email' })
  readonly username: string;

  @Length(8)
  @MaxLength(64)
  @ApiProperty({ example: 'TestPassword', description: 'password' })
  readonly password: string;

  @IsOptional()
  @ApiProperty({ example: Date.now(), description: 'timestamp' })
  readonly passwordExpiresAt?: number;
}
