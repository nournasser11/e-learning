
import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from 'src/dto/create-note.dto';
import { UpdateNoteDto } from 'src/dto/update-note.dto';
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

  @Get(':noteId')
async findOne(@Param('noteId') noteId: string,
  @Query('userId') userId:string
): Promise<Note> {
  return this.notesService.findOne(noteId,userId);
}

  @Put(':noteId')
  async update(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Query('userId') userId: string,
  ): Promise<Note> {
    return this.notesService.update(noteId, updateNoteDto, userId);
  }

  @Delete(':noteId')
  async remove(@Param('noteId') noteId: string, @Query('userId') userId: string): Promise<Note> {
    return this.notesService.remove(noteId, userId);
  }
}
