import { Request } from 'express';

export const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  let error: Error = null;
  if (!file) {
    error = new Error('The file is required');
    return cb(error, false);
  }
  const validExtensions = ['jpg', 'png'];
  const typeFile = file.mimetype.split('/')[1];
  const isValidExtension = validExtensions.some((ext) => ext === typeFile);
  if (!isValidExtension) {
    error = new Error('The file has invalid extension file');
    return cb(error, false);
  }
  cb(null, true);
};
