import { Request } from 'express';

export const fileNameEditor = (
req: Request,
file: any,
callback: (error: any, filename) => void,
) => {
const newFileName = 'whatever' + file.originalname;

callback(null, newFileName);

};