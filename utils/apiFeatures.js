class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Consolidate final filter
    this.query = this.query.find({
      ...JSON.parse(queryStr),
      ...this.applyDateFilter(queryObj),
    });
    return this;
  }
  /**
   * applyDateFilter: Checks for fields with date strings (e.g., 'YYYY-MM-DD')
   * and converts them to a date range covering that full day.
   * @param {Object} queryObj - Parsed query object with filters
   * @returns {Object} Date filter conditions to merge with main query
   */
  applyDateFilter(queryObj) {
    const dateFilter = {};
    for (const key in queryObj) {
      if (queryObj[key].match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(queryObj[key]);
        if (!isNaN(date)) {
          //query = gte:2024-11-05
          //lt:2024-11-06 it will not be incuded
          dateFilter[key] = { $gte: date, $lt: new Date(date.getTime() + 86400000) }; // include full day
        }
      }
    }
    return dateFilter;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      // რა პარამეტრებსაც მიუთითებ იმას განახებს სერვერი
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // by default __v will be removed from api
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1; //convert to num * 1
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
