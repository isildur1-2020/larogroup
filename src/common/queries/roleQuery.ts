export const roleQuery = [
  // ROLE
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
    $unwind: {
      path: '$role',
      preserveNullAndEmptyArrays: true,
    },
  },
];
