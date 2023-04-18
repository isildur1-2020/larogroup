export const dniQuery = [
  // DNI TYPE
  {
    $lookup: {
      from: 'dnitypes',
      localField: 'dni_type',
      foreignField: '_id',
      as: 'dni_type',
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
  { $unwind: '$dni_type' },
];
