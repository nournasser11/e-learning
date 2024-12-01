import { Injectable, Logger, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Note , NoteDocument} from '../models/notes.Schema';
import { CreateNoteDto, UpdateNoteDto} from '../dto/quick-notes.dto';


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


  async findOne(id: string, userId:string): Promise<Note> {
    const query = { _id: new Types.ObjectId(id), userId };
    const note = await this.noteModel.findOne(query).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  
    return note;
  }
  
  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    const updatedNote = await this.noteModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id), userId }, updateNoteDto, { new: true })
      .exec();
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
  }

  async remove(id: string, userId: string): Promise<Note> {
    const deletedNote = await this.noteModel
      .findOneAndDelete({ _id: new Types.ObjectId(id), userId })
      .exec();
    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return deletedNote;
  }
}
