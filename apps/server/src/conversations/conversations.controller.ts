import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { WorkspaceGuard } from '~/workspaces/workspaces.guard';
import { ZodValidationPipe } from '~/shared/zod-validation.pipe';
import { GetConversationsListQuerySchema, TGetConversationsListQuery } from './conversations.schema';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) { }

  // FIXME: should add guard to check if user is in workspace
  @Get()
  getConversationsList(
    @Query(new ZodValidationPipe(GetConversationsListQuerySchema)) query: TGetConversationsListQuery
  ) {
    return this.conversationsService.getConversations(query.workspaceId);
  }
}
