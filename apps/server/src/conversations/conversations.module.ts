import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsModel } from './conversations.model';
import { WorkspacesModule } from '~/workspaces/workspaces.module';
import { AuthModule } from '~/auth/auth.module';
import { ConversationsGateway } from './conversations.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule, WorkspacesModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsModel, ConversationsGateway],
})
export class ConversationsModule {}
