export const reasonQuery = [
  // REASON
  {
    $lookup: {
      from: 'reasons',
      localField: 'reason',
      foreignField: '_id',
      as: 'reason',
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
  { $unwind: '$reason' },
];
