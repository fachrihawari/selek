import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import type { LoginDto, RegisterDto } from './auth.schema';
import { UserService } from '~/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: RegisterDto) {
    const user = await this.userService.findByEmail(body.email);
    if (user) {
      throw new ConflictException('Email already exists');
    }

    await this.userService.create(body);
    return { message: 'User registered successfully' };
  }

  async login(body: LoginDto) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await compare(body.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.jwtService.signAsync({ sub: user.id });
    return { access_token };
  }
}
