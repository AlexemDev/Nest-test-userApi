import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.model';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import * as bcrypt from 'bcrypt';
import { RecoverPassDto } from './dto/recoverPass.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly configService: ConfigService,
  ) {}

  async registration(user: UserDto) {
    const createdUser = await this.pipeUserDto(user);
    const { id, username } = await this.usersRepository.save(createdUser);
    return {
      id,
      username,
    };
  }

  async getUser(userName: string): Promise<UserDto> {
    const username = userName.toLowerCase();
    return await this.usersRepository.findOne({ where: { username } });
  }

  async changePassword(
    { username }: UserDto,
    { oldPassword, newPassword }: RecoverPassDto,
  ) {
    const { password } = await this.getUser(username);
    const isPasswordValid = await bcrypt.compare(oldPassword, password);

    if (!isPasswordValid) {
      throw new NotAcceptableException(
        'Current password does not match with any of our records',
      );
    }
    const hashedPassword = await this.hashPassword(newPassword);

    return await this.findByUsernameAndUpdatePassword(username, hashedPassword);
  }

  private async findByUsernameAndUpdatePassword(
    username,
    hashedPassword,
  ): Promise<UserDto> {
    const updateUser = await this.usersRepository.update(
      { username },
      { password: hashedPassword },
    );

    return updateUser.raw?.[0];
  }

  private async hashPassword(password: string): Promise<string> {
    const hashWorkFactor = this.configService.get<number>('HASH_WORK_FACTOR');
    const hashedPassword = await bcrypt.hash(password, hashWorkFactor);

    return hashedPassword;
  }

  private async pipeUserDto({ username, password }: UserDto): Promise<UserDto> {
    return {
      username: username.toLowerCase(),
      password: await this.hashPassword(password),
    };
  }
}
