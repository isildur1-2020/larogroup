import { AccessGroup } from 'src/access_group/entities/access_group.entity';

export interface Entity {
  is_active: boolean;
  contract_end_date: string;
  access_group: AccessGroup[];
}
