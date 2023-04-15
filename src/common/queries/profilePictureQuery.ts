export const profilePictureQuery = [
  // PROFILE PICTURE
  {
    $lookup: {
      from: 'profilepictures',
      localField: 'profile_picture',
      foreignField: '_id',
      as: 'profile_picture',
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
      path: '$profile_picture',
      preserveNullAndEmptyArrays: true,
    },
  },
];
