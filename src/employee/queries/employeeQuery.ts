import { roleQuery } from 'src/common/queries/roleQuery';
import { profilePictureQuery } from 'src/common/queries/profilePictureQuery';

export const employeeQuery = [
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
  {
    $unwind: {
      path: '$dni_type',
      preserveNullAndEmptyArrays: true,
    },
  },
  ...profilePictureQuery,
  ...roleQuery,
  // CATEGORIES
  {
    $lookup: {
      from: 'categories',
      localField: 'categories',
      foreignField: '_id',
      as: 'categories',
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
  {
    $unwind: {
      path: '$categories',
      preserveNullAndEmptyArrays: true,
    },
  },
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
        {
          $unwind: {
            path: '$country',
            preserveNullAndEmptyArrays: true,
          },
        },
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
      path: '$city',
      preserveNullAndEmptyArrays: true,
    },
  },
  // CAMPUS
  {
    $lookup: {
      from: 'campus',
      localField: 'campus',
      foreignField: '_id',
      as: 'campus',
      pipeline: [
        // SUB COMPANY
        {
          $lookup: {
            from: 'subcompanies',
            localField: 'sub_company',
            foreignField: '_id',
            as: 'sub_company',
            pipeline: [
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
              {
                $unwind: {
                  path: '$company',
                  preserveNullAndEmptyArrays: true,
                },
              },
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
        {
          $unwind: {
            path: '$sub_company',
            preserveNullAndEmptyArrays: true,
          },
        },
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
      path: '$campus',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      is_active: 0,
    },
  },
];
