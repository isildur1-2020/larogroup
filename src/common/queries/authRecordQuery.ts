// import { zoneQuery } from './zoneQuery';
import { directionQuery } from './directionQuery';
import { categoriesQuery } from './categoriesQuery';

export const authRecordQuery = [
  // DEVICES
  {
    $lookup: {
      from: 'devices',
      localField: 'device',
      foreignField: '_id',
      as: 'device',
      pipeline: [
        // ...zoneQuery,
        ...directionQuery,
        {
          $project: {
            sn: 0,
            campus: 0,
            is_online: 0,
            createdAt: 0,
            updatedAt: 0,
            check_attendance: 0,
            uncheck_attendance: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$device' },
  // EMPLOYEE
  {
    $lookup: {
      from: 'employees',
      localField: 'employee',
      foreignField: '_id',
      as: 'employee',
      pipeline: [
        ...categoriesQuery,
        {
          $lookup: {
            from: 'campus',
            localField: 'campus',
            foreignField: '_id',
            as: 'campus',
            pipeline: [
              {
                $lookup: {
                  from: 'subcompanies',
                  localField: 'sub_company',
                  foreignField: '_id',
                  as: 'sub_company',
                  pipeline: [
                    {
                      $project: {
                        city: 0,
                        company: 0,
                        createdAt: 0,
                        updatedAt: 0,
                      },
                    },
                  ],
                },
              },
              { $unwind: '$sub_company' },
              {
                $project: {
                  name: 0,
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$campus' },
        {
          $project: {
            role: 0,
            rfid: 0,
            city: 0,
            barcode: 0,
            dni_type: 0,
            createdAt: 0,
            updatedAt: 0,
            is_active: 0,
            access_group: 0,
            contract_end_date: 0,
            contract_start_date: 0,
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: '$employee',
      preserveNullAndEmptyArrays: true,
    },
  },
  // VEHICLES
  {
    $lookup: {
      from: 'vehicles',
      localField: 'vehicle',
      foreignField: '_id',
      as: 'vehicle',
      pipeline: [
        {
          $project: {
            role: 0,
            barcode: 0,
            is_active: 0,
            access_group: 0,
            contract_end_date: 0,
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: '$vehicle',
      preserveNullAndEmptyArrays: true,
    },
  },
  // GLOBAL PROJECT
  {
    $project: {
      data: 0,
      zone: 0,
      entity_id: 0,
      updatedAt: 0,
      access_group: 0,
      authentication_method: 0,
    },
  },
];
