import { Controller } from '@nestjs/common';
import { Get, Post, Body, Param } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from '../dto/create-response.dto';

@Controller('responses')
export class ResponsesController {
    constructor(private readonly responsesService: ResponsesService) {}

    @Post()
    create(@Body() createResponseDto: CreateResponseDto) {
        return this.responsesService.create(createResponseDto);
    }

    @Get()
    findAll() {
        return this.responsesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.responsesService.findOne(Number(id));
    }
}

