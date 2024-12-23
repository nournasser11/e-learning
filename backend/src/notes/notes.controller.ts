import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from 'src/dto/create-note.dto';
import { UpdateNoteDto } from  'src/dto/update-note.dto';
import { Note } from 'src/models/notes.Schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll(@Query('userId') userId: string, @Query('courseId') courseId: string): Promise<Note[]> {
    return this.notesService.findAll(userId, courseId); // Filter by userId and courseId
  }

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto); // Create a new note
  }

  @Put(':noteId')
async update(
  @Param('noteId') noteId: string,
  @Body() updateNoteDto: UpdateNoteDto,
  @Query('courseId') courseId: string
): Promise<Note> {
  console.log(`Received noteId: ${noteId}, courseId: ${courseId}`); // Log for debugging
  return this.notesService.update(noteId, updateNoteDto, courseId);
}

  

@Delete(':noteId')
async remove(
  @Param('noteId') noteId: string,
  @Query('courseId') courseId: string
): Promise<Note> {
  console.log(`Received noteId: ${noteId}, courseId: ${courseId}`); // Log for debugging
  return this.notesService.remove(noteId, courseId); // Pass courseId to the service
}
}