import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: ClientProxy,
  ) {}

  @Get()
  async getUser() {
    return this.authService.send({ cmd: 'get-users' }, {});
  }

  @Post()
  async createUser() {
    return this.authService.send({ cmd: 'save-user' }, {});
  }
}
