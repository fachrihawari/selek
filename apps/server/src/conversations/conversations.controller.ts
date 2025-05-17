import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { WorkspaceGuard } from '~/workspaces/workspaces.guard';
import { ZodValidationPipe } from '~/shared/zod-validation.pipe';
import {
  CreateMessageSchema,
  GetConversationsListQuerySchema,
  TCreateMessage,
  TGetConversationsListQuery,
} from './conversations.schema';
import { AuthGuard } from '~/auth/auth.guard';
import { AuthUser } from '~/auth/auth-user.decorator';
import { TUserSafe } from '~/users/users.schema';
import { ConversationGuard } from './conversations.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageCreatedEvent } from './conversations.event';
import { emitterEvents } from './conversations.constant';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @UseGuards(WorkspaceGuard)
  getConversationsList(
    @AuthUser() user: TUserSafe,
    @Query(new ZodValidationPipe(GetConversationsListQuerySchema))
    query: TGetConversationsListQuery,
  ) {
    return this.conversationsService.getGrouppedConversations(
      query.workspaceId,
      user.id,
    );
  }

  @Get('/:conversationId')
  @UseGuards(ConversationGuard)
  async getConversation(@Param('conversationId') conversationId: string) {
    const conversation =
      await this.conversationsService.getConversation(conversationId);
    return conversation;
  }

  @Get('/:conversationId/messages')
  @UseGuards(ConversationGuard)
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.conversationsService.getMessages(conversationId, +page, +limit);
  }

  @Post('/:conversationId/messages')
  @HttpCode(201)
  @UseGuards(ConversationGuard)
  async createMessage(
    @AuthUser() user: TUserSafe,
    @Param('conversationId') conversationId: string,
    @Body(new ZodValidationPipe(CreateMessageSchema)) body: TCreateMessage,
  ) {
    const newMessage = {
      senderId: user.id,
      content: body.content,
      conversationId: conversationId,
    };
    // Create the message
    const message = await this.conversationsService.createMessage(newMessage);

    // Emit the event to notify ConversationsGateway
    this.eventEmitter.emit(
      emitterEvents.MESSAGES_CREATED,
      new MessageCreatedEvent(conversationId, message),
    );

    return message;
  }
}
