export const cityQuery = [
  {
    $lookup: {
      from: 'cities',
      localField: 'city',
      foreignField: '_id',
      as: 'city',
      pipeline: [
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
                },
              },
            ],
          },
        },
        { $unwind: '$country' },
        {
          $project: {
            updatedAt: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$city' },
];
