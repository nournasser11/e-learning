import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../models/notes.Schema';
import { CreateNoteDto } from 'src/dto/create-note.dto';
import { UpdateNoteDto } from 'src/dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async findAll(userId: string, courseId: string): Promise<Note[]> {
    return this.noteModel.find({ userId, courseId }).exec(); // Get notes by userId and courseId
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const newNote = new this.noteModel(createNoteDto);
    return newNote.save(); // Save the new note
  }

  // Update a note
  async update(
    noteId: string,
    updateNoteDto: UpdateNoteDto,
    courseId: string
  ): Promise<Note> {
    const updatedNote = await this.noteModel.findOneAndUpdate(
      { noteId, courseId },
      { $set: updateNoteDto },
      { new: true } // Return the updated note
    ).exec();
  
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${noteId} and Course ID ${courseId} not found`);
    }
  
    return updatedNote;
  }
  

  
  async remove(noteId: string, userId: string): Promise<Note> {
    const deletedNote = await this.noteModel.findOneAndDelete({ _id: noteId, userId }).exec();

    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${noteId} not found`); // Handle not found
    }

    return deletedNote; // Return the deleted note
  }
}
