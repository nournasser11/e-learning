import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto} from '../dto/quick-notes.dto';
import { Note } from '../models/notes.Schema';
import { query } from 'express';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Query('userId') userId: string): Promise<Note> {
    return this.notesService.create(createNoteDto, userId);
  }

  @Get()
  async findAll(@Query('userId') userId: string): Promise<Note[]> {
    return this.notesService.findAll(userId);
  }

  @Get(':id')
async findOne(@Param('id') id: string,
  @Query('userId') userId:string
): Promise<Note> {
  return this.notesService.findOne(id,userId);
}

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Query('userId') userId: string,
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('userId') userId: string): Promise<Note> {
    return this.notesService.remove(id, userId);
  }
}
