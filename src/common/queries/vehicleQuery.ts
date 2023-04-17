import { profilePictureQuery } from './profilePictureQuery';
import { roleQuery } from './roleQuery';

export const vehicleQuery = [
  // VEHICLE
  ...roleQuery,
  ...profilePictureQuery,
  {
    $project: {
      updatedAt: 0,
    },
  },
];
