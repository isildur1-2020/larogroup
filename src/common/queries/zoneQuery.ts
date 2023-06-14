export const zoneQuery = [
  {
    $lookup: {
      from: 'zones',
      localField: 'access_zone',
      foreignField: '_id',
      as: 'access_zone',
      pipeline: [
        {
          $project: {
            devices: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: '$access_zone',
      preserveNullAndEmptyArrays: true,
    },
  },
];
