export const directionQuery = [
  // REASON
  {
    $lookup: {
      from: 'reasons',
      localField: 'direction',
      foreignField: '_id',
      as: 'direction',
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
  { $unwind: '$direction' },
];
