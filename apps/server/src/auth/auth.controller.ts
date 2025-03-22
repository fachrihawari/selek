import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/zod-validation.pipe';
import { RegisterDto, RegisterSchema } from './auth.schema';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) body: RegisterDto,
  ) {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    await this.userService.create(body);

    return {
      message: 'User has been registered',
    };
  }

  @Post('login')
  login() {
    return {
      message: 'login',
    };
  }
}
