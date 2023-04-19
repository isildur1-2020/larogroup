export const countryQuery = [
  {
    $lookup: {
      from: 'countries',
      localField: 'country',
      foreignField: '_id',
      as: 'country',
      pipeline: [
        {
          $project: {
            updatedAt: 0,
            createdAt: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$country' },
  {
    $project: {
      updatedAt: 0,
      createdAt: 0,
    },
  },
];
