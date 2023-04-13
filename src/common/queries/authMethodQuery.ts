export const authMethodQuery = [
  // AUTHENTICATION METHODS
  {
    $lookup: {
      from: 'authenticationmethods',
      localField: 'authentication_method',
      foreignField: '_id',
      as: 'authentication_method',
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
  { $unwind: '$authentication_method' },
];
