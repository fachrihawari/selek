import { Logger, LoggerService, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket as SocketIO } from 'socket.io';
import { WsAuthGuard } from '~/auth/ws-auth.guard';
import { TUserSafe } from '~/users/users.schema';
import { ConversationsService } from './conversations.service';
import { instrument } from '@socket.io/admin-ui';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageCreatedEvent } from './conversations.event';
import { WorkspacesService } from '~/workspaces/workspaces.service';
import {
  emitterEvents,
  socketEvents,
  socketRooms,
} from './conversations.constant';

interface Socket extends SocketIO {
  user: TUserSafe;
}

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: ['https://admin.socket.io', process.env.CLIENT_URL],
    credentials: true,
  },
})
export class ConversationsGateway implements OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(ConversationsGateway.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly workspacesService: WorkspacesService,
    private readonly conversationsService: ConversationsService,
  ) {}

  afterInit(server: Server) {
    instrument(server, {
      auth: false,
      mode: this.configService.get('NODE_ENV'),
    });
  }

  @SubscribeMessage(socketEvents.WORKSPACES_JOIN)
  async handleWorkspacesJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() workspaceId: string,
  ) {
    const member = await this.workspacesService.findWorkspaceMember(
      socket.user.id,
      workspaceId,
    );

    if (!member) {
      this.logger.warn(
        `User ${socket.user.id} is not a member of workspace ${workspaceId}`,
      );
      return;
    }

    this.logger.verbose('Connected user ->', socket.id);
    this.logger.verbose(socket.user);
    this.logger.verbose('joining room -> workspaces:' + workspaceId);
    await socket.join(socketRooms.getWorkspace(workspaceId));
  }

  @SubscribeMessage(socketEvents.WORKSPACES_LEAVE)
  async handleWorkspacesLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() workspaceId: string,
  ) {
    this.logger.verbose('Connected user ->', socket.id);
    this.logger.verbose(socket.user);
    this.logger.verbose('leaving room -> workspaces:' + workspaceId);
    await socket.leave(socketRooms.getWorkspace(workspaceId));
  }

  @SubscribeMessage(socketEvents.CONVERSATIONS_JOIN)
  async handleConversationsJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() conversationId: string,
  ) {
    const isMember = await this.conversationsService.isConversationMember(
      socket.user.id,
      conversationId,
    );

    if (!isMember) {
      this.logger.warn(
        `User ${socket.user.id} is not a member of conversation ${conversationId}`,
      );
      return;
    }

    this.logger.verbose('Connected user ->', socket.id);
    this.logger.verbose(socket.user);
    this.logger.verbose('joining room -> conversations:' + conversationId);
    await socket.join(socketRooms.getConversation(conversationId));
  }

  @SubscribeMessage(socketEvents.CONVERSATIONS_LEAVE)
  async handleConversationsLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() conversationId: string,
  ) {
    this.logger.verbose('Connected user ->', socket.id);
    this.logger.verbose(socket.user);
    this.logger.verbose('leaving room -> conversations:' + conversationId);
    await socket.leave(socketRooms.getConversation(conversationId));
  }

  @OnEvent(emitterEvents.MESSAGES_CREATED)
  handleMessageCreated({ message, conversationId }: MessageCreatedEvent) {
    this.logger.verbose('Message created event received');
    this.logger.verbose('Message ->', message);
    this.logger.verbose('Conversation ID ->', conversationId);
    this.server
      .to(socketRooms.getConversation(conversationId))
      .emit(socketEvents.MESSAGES_NEW, message);

    // Send notification to all members of the workspace
    // this.server.to(socketRooms.getWorkspace(message.workspaceId))
    //   .emit(socketEvents.WORKSPACES_NOTIFICATIONS, {message});
  }
}
