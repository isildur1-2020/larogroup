import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

export const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};
