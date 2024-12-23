import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note, NotesSchema } from '../models/notes.schema';
@Module({
    imports: [MongooseModule.forFeature([{ name: Note.name, schema: NotesSchema }])],
    controllers: [NotesController],
    providers: [NotesService],
    exports: [NotesService],
})
export class NotesModule {}