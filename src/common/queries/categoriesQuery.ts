export const categoriesQuery = [
  // CATEGORIES
  {
    $lookup: {
      from: 'categories',
      let: { pid: '$categories' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$pid'] } } },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            sub_company: 0,
          },
        },
      ],
      as: 'categories',
    },
  },
];
