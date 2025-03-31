import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './users.model';

@Module({
  providers: [UsersService, UsersModel],
  exports: [UsersService],
})
export class UsersModule {}
