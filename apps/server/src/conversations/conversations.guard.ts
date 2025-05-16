import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Request } from 'express';

@Injectable()
export class ConversationGuard implements CanActivate {
  private readonly logger = new Logger(ConversationGuard.name);

  constructor(private conversationsService: ConversationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const conversationId = this.getConversationId(request);

    if (!conversationId) {
      this.logger.warn('Conversation ID missing in request');
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
    }

    if (!user) {
      this.logger.warn('Unauthenticated access attempt');
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
    }

    try {
      const isMember = await this.conversationsService.isConversationMember(
        user.id,
        conversationId,
      );

      if (!isMember) {
        this.logger.log(
          `Access denied for user ${user.id} on conversation ${conversationId}`,
        );
        throw new ForbiddenException('Access denied'); // Use generic error for security reasons
      }

      return true;
    } catch (error) {
      this.logger.error(`Conversation access check failed: ${error.message}`);
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
    }
  }

  private getConversationId(request: Request): string | null {
    return (
      request.params?.conversationId ||
      request.body?.conversationId ||
      request.query?.conversationId
    );
  }
}
