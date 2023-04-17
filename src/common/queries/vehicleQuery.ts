import { roleQuery } from './roleQuery';

export const vehicleQuery = [
  // VEHICLE
  {
    $lookup: {
      from: 'vehicles',
      localField: 'vehicle',
      foreignField: '_id',
      as: 'vehicle',
      pipeline: [
        ...roleQuery,
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
      path: '$vehicle',
      preserveNullAndEmptyArrays: true,
    },
  },
];
