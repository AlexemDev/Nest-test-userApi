import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {UserDto} from "../users/dto/user.dto";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string }> {
    const user = await this.usersService.getUser(username);

    if (!user) {
      throw new NotAcceptableException(`User ${username} does not exist`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotAcceptableException('Incorrect password');
    }

    if (user && isPasswordValid) {
      return {
        username: user.username,
      };
    }

    return null;
  }
}
