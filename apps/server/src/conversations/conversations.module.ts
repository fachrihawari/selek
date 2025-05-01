import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsModel } from './conversations.model';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsModel],
})
export class ConversationsModule {}
