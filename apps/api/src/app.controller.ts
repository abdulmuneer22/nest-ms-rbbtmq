import { Controller, Get, Inject, Post } from '@nestjs/common';
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

  @Post()
  async createUser() {
    return this.authService.send({ cmd: 'save-user' }, {});
  }

  @Get('/presence')
  async getPresence() {
    return this.presenceSerice.send({ cmd: 'get-presence' }, {});
  }
}
