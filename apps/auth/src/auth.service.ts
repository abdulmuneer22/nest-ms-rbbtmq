import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO, UserDTO } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositiory: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepositiory.find();
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepositiory.findOne({
      where: {
        email: email,
      },
      select: ['email', 'firstName', 'lastName', 'password'],
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  async saveUser(userDTO: CreateUserDTO): Promise<UserEntity> {
    const existingUser = await this.getUserByEmail(userDTO.email);

    if (existingUser) {
      throw new BadRequestException('Email Already exists');
    }

    const user = new UserEntity();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.password = await this.hashPassword(userDTO.password);
    const newUser = await user.save();
    delete newUser.password;
    return newUser;
  }

  async validatePassword(password, hashedPassed): Promise<boolean> {
    return bcrypt.compare(password, hashedPassed);
  }

  async validateUser(email, password): Promise<UserEntity> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isVerified = await this.validatePassword(password, user.password);

    if (isVerified) {
      return user;
    }

    return null;
  }

  async login(userDTO: UserDTO) {
    const { email, password } = userDTO;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync({
      user,
    });
    return { token: jwt };
  }

  async verifyJWT(jwt: string) {
    if (!jwt) {
      throw new UnauthorizedException('Failed');
    }

    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new UnauthorizedException('FAILED');
    }
  }
}
