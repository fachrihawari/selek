import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { WorkspaceGuard } from '~/workspaces/workspaces.guard';
import { ZodValidationPipe } from '~/shared/zod-validation.pipe';
import {
  CreateMessageSchema,
  GetConversationsListQuerySchema,
  TGetConversationsListQuery,
} from './conversations.schema';
import { AuthGuard } from '~/auth/auth.guard';
import { AuthUser } from '~/auth/auth-user.decorator';
import { TUserSafe } from '~/users/users.schema';
import { ConversationGuard } from './conversations.guard';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) { }

  @Get()
  @UseGuards(WorkspaceGuard)
  getConversationsList(
    @AuthUser() user: TUserSafe,
    @Query(new ZodValidationPipe(GetConversationsListQuerySchema))
    query: TGetConversationsListQuery,
  ) {
    return this.conversationsService.getGrouppedConversations(query.workspaceId, user.id);
  }

  @Get('/:conversationId')
  @UseGuards(ConversationGuard)
  async getConversation(
    @Param('conversationId') conversationId: string,
  ) {
    const conversation = await this.conversationsService.getConversation(
      conversationId,
    );
    return conversation;
  }

  @Get('/:conversationId/messages')
  @UseGuards(ConversationGuard)
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.conversationsService.getMessages(conversationId, page, limit);
  }

  @Post('/:conversationId/messages')
  @HttpCode(201)
  @UseGuards(ConversationGuard)
  async createMessage(
    @AuthUser() user: TUserSafe,
    @Param('conversationId') conversationId: string,
    @Body(new ZodValidationPipe(CreateMessageSchema)) body
  ) {

    const newMessage = {
      senderId: user.id,
      content: body.content,
      conversationId: conversationId,
    }
    return this.conversationsService.createMessage(newMessage);
  }
}
