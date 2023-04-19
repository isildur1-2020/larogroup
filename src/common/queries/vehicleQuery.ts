import { roleQuery } from './roleQuery';
import { profilePictureQuery } from './profilePictureQuery';

export const vehicleQuery = [
  // VEHICLE
  ...roleQuery,
  ...profilePictureQuery,
  {
    $project: {
      updatedAt: 0,
    },
  },
  {
    $unwind: {
      path: '$vehicle',
      preserveNullAndEmptyArrays: true,
    },
  },
];
