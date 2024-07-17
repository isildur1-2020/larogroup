db.collection.aggregate([
    // Step 1: Match Stage
    {
      $match: {
        status: { $eq: "active" },
        createdAt: { $gte: ISODate("2023-01-01") }
      }
    },
    // Step 2: Lookup Stage to join with another collection
    {
      $lookup: {
        from: 'relatedCollection',
        let: { foreignKey: "$foreignKey" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$foreignKey", "$$foreignKey"] },
                  { $eq: ["$status", "active"] }
                ]
              }
            }
          },
          {
            $project: {
              field1: 1,
              field2: 1,
              nestedField: "$nested.field"
            }
          }
        ],
        as: 'relatedDocs'
      }
    },
    // Step 3: Unwind Stage
    {
      $unwind: {
        path: "$relatedDocs",
        preserveNullAndEmptyArrays: true
      }
    },
    // Step 4: Group Stage
    {
      $group: {
        _id: "$groupId",
        total: { $sum: "$amount" },
        docs: { $push: "$$ROOT" }
      }
    },
    // Step 5: Sort Stage
    {
      $sort: { total: -1 }
    },
    // Step 6: Project Stage
    {
      $project: {
        _id: 0,
        groupId: "$_id",
        totalAmount: "$total",
        documents: {
          $map: {
            input: "$docs",
            as: "doc",
            in: {
              id: "$$doc._id",
              name: "$$doc.name",
              nestedField: "$$doc.relatedDocs.nestedField",
              createdAt: "$$doc.createdAt"
            }
          }
        }
      }
    }
  ])