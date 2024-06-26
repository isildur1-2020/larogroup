export const companyQuery = [
  {
    $lookup: {
      from: 'companies',
      localField: 'company',
      foreignField: '_id',
      as: 'company',
      pipeline: [
        {
          $project: {
            city: 0,
            country: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$company' },
  // GLOBAL PROJECT
  {
    $project: {
      createdAt: 0,
      updatedAt: 0,
    },
  },
];
