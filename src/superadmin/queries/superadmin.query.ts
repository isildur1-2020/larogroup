export const superadminQuery = [
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
      password: 0,
      updatedAt: 0,
      is_active: 0,
    },
  },
];
