class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering...
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering...
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, (match) => `$${match}`); // "g" is needed to repalace all occurances and not just the first one, "\b" is specified to look for those exact words

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2) Sorting...
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // if no sort specified, documents will be stored by newest
    }
    return this;
  }

  limitFields() {
    // 3) Field limiting...
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // "-" (minus) means is do disclude some fields in the query string, except the "__v" field (- is exclusion)
    }

    return this;
  }

  paginate() {
    // 4) Pagination...
    const page = this.queryString.page * 1 || 1; // defining default values
    const limit = this.queryString.limit * 1 || 100; // page limiting
    const skip = (page - 1) * limit;

    // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3
    this.query = this.query.skip(skip).limit(limit); // for the Nth page

    return this; // by returning "this", it allows to chain objects together
  }
}

module.exports = APIfeatures;
