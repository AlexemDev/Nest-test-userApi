import {
  Controller,
  Body,
  Res,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { RecoverPassDto } from './dto/recoverPass.dto';
import { AuthenticatedGuard } from '../auth/authentificated.guard';
import { ApiStatusMessages } from '../apiStatusMessages';
import { ConfigService } from '@nestjs/config';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/register')
  async register(@Body() newUser: UserDto, @Res() res?: Response) {
    try {
      const user = await this.usersService.registration(newUser);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (err) {
      const duplicate = 11000;
      if (err.code === duplicate) {
        throw new BadRequestException(
          'Account with this email already exists.',
        );
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err });
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(
    @Body() newUser: UserDto,
    @Request() req,
    @Res() res?: Response,
  ): Response {
    const isPasswordExpired =
      Date.now() - req.user.expires.passwordExpiresAt >= 0;
    if (isPasswordExpired) {
      return res.status(HttpStatus.UNAUTHORIZED);
    }
    req.user.expires.passwordExpiresAt =
      Date.now() + this.configService.get<number>('PASSWORD_EXPIRES_IN_MS');
    return res.status(HttpStatus.OK).json({ session: req.user });
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/user/change-password')
  async changePassword(
    @Body() recoverPassObj: RecoverPassDto,
    @Request() req,
    @Res() res?: Response,
  ): Promise<Response> {
    try {
      await this.usersService.changePassword(
        req.session.passport.user,
        recoverPassObj,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: ApiStatusMessages.PASSWORD_SUCCESSFULLY_UPDATED });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err });
    }
  }
}
