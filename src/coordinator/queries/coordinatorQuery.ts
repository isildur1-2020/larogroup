export const coordinatorQuery = [
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
  {
    $unwind: '$role',
  },
  {
    $lookup: {
      from: 'subcompanies',
      localField: 'sub_company',
      foreignField: '_id',
      as: 'sub_company',
      pipeline: [
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
                  country: 0,
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
            city: 0,
            country: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$sub_company' },
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
          },
        },
      ],
    },
  },
  { $unwind: '$campus' },
  {
    $project: {
      is_active: 0,
      password: 0,
      updatedAt: 0,
    },
  },
];
