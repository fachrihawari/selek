import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/zod-validation.pipe';
import { LoginSchema, RegisterSchema } from './auth.schema';
import type { LoginDto, RegisterDto } from './auth.schema';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthUser } from './auth-user.decorator';
import type { TUserSafe } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) body: RegisterDto,
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body(new ZodValidationPipe(LoginSchema)) body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@AuthUser() user: TUserSafe) {
    return user;
  }
}
