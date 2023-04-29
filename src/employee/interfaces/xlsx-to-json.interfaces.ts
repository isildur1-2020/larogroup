interface XLSXEmployee {
  _id?: string;
  employee_id: number;
  dni_type: string;
  dni: string;
  first_name: string;
  second_name?: string;
  first_lastname: string;
  second_lastname?: string;
  email?: string;
  phone?: string;
  categories: string;
  campus: string;
  city: string;
  access_group: string;
  barcode: string;
  rfid: string;
  contract_start_date: Date;
  contract_end_date: Date;
  profile_picture?: string[];
}
