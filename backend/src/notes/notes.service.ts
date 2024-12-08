import { Injectable, Logger, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Note , NoteDocument} from '../models/notes.Schema';
import { CreateNoteDto } from 'src/dto/create-note.dto';
import { UpdateNoteDto } from 'src/dto/update-note.dto';


@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    this.logger.log('Creating a new note');
    const newNote = new this.noteModel({ ...createNoteDto, userId });
    return newNote.save();
  }

  async findAll(userId: string): Promise<Note[]> {
    return this.noteModel.find({ userId }).exec();
  }


  async findOne(noteId: string, userId:string): Promise<Note> {
    const query = {noteId, userId };
    const note = await this.noteModel.findOne(query).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
  
    return note;
  }
  
  async update(noteId: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    const updatedNote = await this.noteModel
      .findOneAndUpdate({noteId, userId }, updateNoteDto, { new: true })
      .exec();
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
    return updatedNote;
  }

  async remove(noteId: string, userId: string): Promise<Note> {
    const deletedNote = await this.noteModel
      .findOneAndDelete({ noteId, userId })
      .exec();
    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
    return deletedNote;
  }
}

