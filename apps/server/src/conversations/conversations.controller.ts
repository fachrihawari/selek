import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { WorkspaceGuard } from '~/workspaces/workspaces.guard';
import { ZodValidationPipe } from '~/shared/zod-validation.pipe';
import {
  GetConversationsListQuerySchema,
  TGetConversationsListQuery,
} from './conversations.schema';
import { AuthGuard } from '~/auth/auth.guard';
import { AuthUser } from '~/auth/auth-user.decorator';
import { TUserSafe } from '~/users/users.schema';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @UseGuards(WorkspaceGuard)
  getConversationsList(
    @AuthUser() user: TUserSafe,
    @Query(new ZodValidationPipe(GetConversationsListQuerySchema))
    query: TGetConversationsListQuery,
  ) {
    return this.conversationsService.getConversations(query.workspaceId, user.id);
  }
}
