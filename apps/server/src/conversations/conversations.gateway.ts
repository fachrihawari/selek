import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket as SocketIO } from 'socket.io';
import { WsAuthGuard } from '~/auth/ws-auth.guard';
import { TUserSafe } from '~/users/users.schema';
import { ConversationsService } from './conversations.service';
import { instrument } from '@socket.io/admin-ui';
import { ConfigService } from '@nestjs/config';

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
  constructor(
    private readonly configService: ConfigService,
    private readonly conversationsService: ConversationsService,
  ) {}

  afterInit(server: Server) {
    instrument(server, {
      auth: false,
      mode: this.configService.get('NODE_ENV'),
    });
  }

  @SubscribeMessage('workspaces:join')
  async handleCome(
    @ConnectedSocket() socket: Socket,
    @MessageBody() workspaceId: string,
  ) {
    const conversations = await this.conversationsService.getConversations(
      workspaceId,
      socket.user.id,
    );

    console.log('Connected user ->', socket.id);
    console.log(socket.user);

    console.log('joining room -> workspaces:' + workspaceId);
    await socket.join('workspaces:' + workspaceId);

    for (const c of conversations) {
      await socket.join('conversations:' + c.id);
      console.log('joining room -> conversations:' + c.id);
    }
  }
}
