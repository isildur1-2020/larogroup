export const employeeQuery = [
  {
    $lookup: {
      from: 'employees',
      localField: 'employee',
      foreignField: '_id',
      as: 'employee',
      pipeline: [
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$role' },
        {
          $lookup: {
            from: 'dnitypes',
            localField: 'dni_type',
            foreignField: '_id',
            as: 'dni_type',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$dni_type' },
        {
          $lookup: {
            from: 'categories',
            localField: 'first_category',
            foreignField: '_id',
            as: 'first_category',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                  sub_company: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$first_category' },
        {
          $lookup: {
            from: 'countries',
            localField: 'country',
            foreignField: '_id',
            as: 'country',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$country' },
        {
          $lookup: {
            from: 'cities',
            localField: 'city',
            foreignField: '_id',
            as: 'city',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                  country: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$city' },
        {
          $project: {
            is_active: 0,
            sub_company: 0,
            contract_start_date: 0,
            contract_end_date: 0,
          },
        },
      ],
    },
  },
  {
    $unwind: '$employee',
  },
];
