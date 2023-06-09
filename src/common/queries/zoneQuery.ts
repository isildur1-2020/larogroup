export const zoneQuery = [
  // ZONE
  {
    $lookup: {
      from: 'zones',
      localField: 'zone',
      foreignField: '_id',
      as: 'zone',
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
      path: '$zone',
      preserveNullAndEmptyArrays: true,
    },
  },
];
