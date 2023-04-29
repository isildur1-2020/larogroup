import { v4 as uuid } from 'uuid';
import { Request } from 'express';

export const fileNamer = (
  _: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  const fileExtension = file.mimetype.split('/')[1];
  cb(null, `${uuid()}.${fileExtension}`);
};

export const xlsxTemplateNamer = (
  _: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  const fileExtension = file.originalname.split('.')[1];
  cb(null, `${uuid()}.${fileExtension}`);
};
