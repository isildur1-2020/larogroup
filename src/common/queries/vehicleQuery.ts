import { roleQuery } from './roleQuery';
import { accessGroupQuery } from './accessGroupQuery';
import { profilePictureQuery } from './profilePictureQuery';

export const vehicleQuery = [
  // VEHICLE
  ...roleQuery,
  ...accessGroupQuery,
  ...profilePictureQuery,
  {
    $unwind: {
      path: '$vehicle',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      access_group: 0,
      createdAt: 0,
      updatedAt: 0,
    },
  },
];
