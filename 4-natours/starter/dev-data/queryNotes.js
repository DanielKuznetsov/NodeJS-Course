// BUILD QUERY

// // 1A) Filtering...
// const queryObj = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach((el) => delete queryObj[el]);

// // 1B) Advanced Filtering...
// let queryStr = JSON.stringify(queryObj);
// queryStr =
//   queryStr.replace(/\bgte|gt|lte|lt\b/g, (match) => `$${match}`)
// ; // "g" is needed to repalace all occurances and not just the first one, "\b" is specified to look for those exact words

// let query = Tour.find(JSON.parse(queryStr));

// // 2) Sorting...
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt'); // if no sort specified, documents will be stored by newest
// }

// // 3) Field limiting...
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v'); // "-" (minus) means is do disclude some fields in the query string, except the "__v" field (- is exclusion)
// }

// // 4) Pagination...
// const page = req.query.page * 1 || 1; // defining default values
// const limit = req.query.limit * 1 || 100; // page limiting
// const skip = (page - 1) * limit;

// // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3
// query = query.skip(skip).limit(limit); // for the Nth page

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new error('This page does not exist');
// }
