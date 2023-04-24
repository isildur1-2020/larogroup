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
    $project: {
      password: 0,
      updatedAt: 0,
      is_active: 0,
    },
  },
];
