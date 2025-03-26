import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import type { LoginDto, RegisterDto } from './auth.schema';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
    return { message: 'User has been registered' };
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

    // Add JWT generation here later
    return {
      access_token: await this.jwtService.signAsync({ sub: user.id }),
    };
  }
}
