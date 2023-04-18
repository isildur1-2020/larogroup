export const catergoriesQuery = [
  // CATEGORIES
  {
    $lookup: {
      from: 'categories',
      let: { pid: '$categories' },
      pipeline: [{ $match: { $expr: { $in: ['$_id', '$$pid'] } } }],
      as: 'categories',
    },
  },
];
