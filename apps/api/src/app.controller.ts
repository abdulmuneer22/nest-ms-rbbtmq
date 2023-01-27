import { AuthGuard } from '@app/shared';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE')
    private readonly presenceSerice: ClientProxy,
  ) {}

  @Get()
  async getUser() {
    return this.authService.send({ cmd: 'get-users' }, {});
  }

  @UseGuards(AuthGuard)
  @Get('/presence')
  async getPresence() {
    return this.presenceSerice.send({ cmd: 'get-presence' }, {});
  }

  @Post('/auth/register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      return this.authService.send(
        { cmd: 'register' },
        {
          firstName,
          lastName,
          email,
          password,
        },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/auth/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      return this.authService.send(
        { cmd: 'login' },
        {
          email,
          password,
        },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
