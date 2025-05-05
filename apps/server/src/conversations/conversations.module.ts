import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsModel } from './conversations.model';
import { WorkspacesModule } from '~/workspaces/workspaces.module';
import { AuthModule } from '~/auth/auth.module';

@Module({
  imports: [AuthModule, WorkspacesModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsModel],
})
export class ConversationsModule {}
