export type Role = {
  _id: string;
  name: string;
};

export type Company = {
  _id: string;
  name: string;
};

export type SubCompany = {
  _id: string;
  name: string;
};

export interface JwtPayload {
  _id: string;
  role: Role;
  sub_company?: SubCompany;
  username: string;
  company: Company;
}
