export const employeeQuery = [
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
  // FIRST CATEGORY
  {
    $lookup: {
      from: 'categories',
      localField: 'first_category',
      foreignField: '_id',
      as: 'first_category',
      pipeline: [
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            sub_company: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$first_category' },
  // CITY
  {
    $lookup: {
      from: 'cities',
      localField: 'city',
      foreignField: '_id',
      as: 'city',
      pipeline: [
        {
          $lookup: {
            from: 'countries',
            localField: 'country',
            foreignField: '_id',
            as: 'country',
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
        { $unwind: '$country' },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$city' },
  // SUB COMPANY
  {
    $lookup: {
      from: 'subcompanies',
      localField: 'sub_company',
      foreignField: '_id',
      as: 'sub_company',
      pipeline: [
        {
          $project: {
            city: 0,
            country: 0,
            createdAt: 0,
            updatedAt: 0,
            company: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$sub_company' },
  // COMPANY
  {
    $lookup: {
      from: 'companies',
      localField: 'company',
      foreignField: '_id',
      as: 'company',
      pipeline: [
        {
          $project: {
            city: 0,
            country: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$company' },
  // CAMPUS
  {
    $lookup: {
      from: 'campus',
      localField: 'campus',
      foreignField: '_id',
      as: 'campus',
      pipeline: [
        {
          $project: {
            sub_company: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$campus' },
  {
    $project: {
      is_active: 0,
      role: 0,
      country: 0,
    },
  },
];
