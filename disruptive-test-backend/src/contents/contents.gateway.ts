import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentService } from './contents.service';
import { Content } from '@prisma/client';

interface GetContentsDto {
  topicId?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: 'asc' | 'desc';
}

interface GetContentCountByCategoryDto {
  topicId?: string;
}

@WebSocketGateway(3001, { namespace: '/contents', transports: ['websocket'], cors: { origin: "*" } })
export class ContentsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ContentsGateway.name);

  constructor(
    @Inject(forwardRef(() => ContentService))
    private readonly contentService: ContentService) { }

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getContents')
  handleGetContents(@MessageBody() data: GetContentsDto, @ConnectedSocket() client: Socket): Observable<WsResponse<Content[]>> {
    const { topicId, name, startDate, endDate, orderBy } = data;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return from(this.contentService.searchContent(topicId, name, start, end, orderBy)).pipe(
      map(contents => ({ event: 'contents', data: contents }))
    );
  }

  @SubscribeMessage('getContentCountByCategory')
  handleGetContentCountByCategory(@MessageBody() data: GetContentCountByCategoryDto, @ConnectedSocket() client: Socket): Observable<WsResponse<{ categoryId: string; count: number }[]>> {
    const { topicId } = data;

    return from(this.contentService.getContentCountByCategory(topicId)).pipe(
      map(counts => ({ event: 'contentCountByCategory', data: counts }))
    );
  }
}