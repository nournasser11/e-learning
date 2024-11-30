import { Controller } from '@nestjs/common';
import { Get, Post, Body, Param } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from '../dto/create-response.dto';

@Controller('responses')
export class ResponsesController {
}

