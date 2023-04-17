export const directionQuery = [
  // DIRECTION
  {
    $lookup: {
      from: 'directions',
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
  {
    $unwind: {
      path: '$direction',
      preserveNullAndEmptyArrays: true,
    },
  },
];
