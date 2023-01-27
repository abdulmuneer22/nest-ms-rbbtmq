import { SharedService } from '@app/shared';
import { Controller, UseGuards } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDTO, UserDTO } from './dto/user.dto';
import { JWTGuard } from './jwt.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return { user: 'FROM AUTH SERVICE' };
  }

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'register' })
  async registerUser(
    @Ctx() context: RmqContext,
    @Payload() newUser: CreateUserDTO,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.saveUser(newUser);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Ctx() context: RmqContext, @Payload() user: UserDTO) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JWTGuard)
  async verifyJWT(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.verifyJWT(payload.jwt);
  }
}
