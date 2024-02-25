import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayloadEnum } from '../auth/enums/jwt-payload.enum';
import { User } from '../common';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiOperation({ summary: 'Get all groups messages' })
  @ApiResponse({ status: 200 })
  @Get()
  getAllUserGroups(
    @User(JwtPayloadEnum.sub) userId: number,
    @Query('message') project: string,
  ) {
    return this.messageService.getChatMessages(userId, Number(project));
  }
}
