import { Controller } from '@nestjs/common';
import { Get, Post, Body, Param } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from '../dto/create-response.dto';


@Controller('responses')
export class ResponsesController {
    constructor(private readonly responsesService: ResponsesService) {}

    @Post()
    async create(@Body() createResponseDto: CreateResponseDto) {
        return this.responsesService.create(createResponseDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.responsesService.findOne(id);
    }

    @Get()
    async findAll() {
        return this.responsesService.findAll();
    }
}
