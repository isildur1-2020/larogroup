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
        // CATEGORY
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
        // CAMPUS
        {
          $lookup: {
            from: 'campus',
            localField: 'campus',
            foreignField: '_id',
            as: 'campus',
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
        { $unwind: '$campus' },
        // SUBCOMPANY
        {
          $lookup: {
            from: 'subcompanies',
            localField: 'sub_company',
            foreignField: '_id',
            as: 'sub_company',
            pipeline: [
              // COMPANY
              {
                $lookup: {
                  from: 'companies',
                  localField: 'company',
                  foreignField: '_id',
                  as: 'company',
                  pipeline: [
                    {
                      $project: {
                        createdAt: 0,
                        updatedAt: 0,
                        city: 0,
                      },
                    },
                  ],
                },
              },
              { $unwind: '$company' },
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$sub_company' },
        // CITY
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
        // GLOBAL PROJECT
        {
          $project: {
            is_active: 0,
            contract_start_date: 0,
            contract_end_date: 0,
            company: 0,
          },
        },
      ],
    },
  },
  {
    $unwind: '$employee',
  },
];
