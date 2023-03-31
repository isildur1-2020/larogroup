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
  role: Role;
  _id: string;
  company: Company;
  sub_company?: SubCompany;
}
