import { ApiProperty } from '@nestjs/swagger';
import { Length, MaxLength } from 'class-validator';

export class RecoverPassDto {
  @ApiProperty({ example: 'TestPassword', description: 'old password' })
  readonly oldPassword: string;

  @Length(8)
  @MaxLength(64)
  @ApiProperty({ example: 'NewTestPassword', description: 'new password' })
  readonly newPassword: string;
}
