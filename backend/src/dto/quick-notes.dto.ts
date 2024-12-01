export class CreateNoteDto {
    readonly content: string;
    readonly moduleId: string;
  }
  
export class UpdateNoteDto {
    readonly content?: string; 
  }