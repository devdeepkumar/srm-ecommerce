class APIFunctionality{
    constructor(query, queryStr) {
        this.query = query,
        this.queryStr= queryStr
    }
    
    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },
            }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        // Removing fields from the query
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((el) => delete queryCopy[el]);

        if (queryCopy.category && typeof queryCopy.category === "string") {
            queryCopy.category = queryCopy.category.toLowerCase().trim();
        }

        // Filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (key) => `$${key}`
        );

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination() {
        const currentPage = Number(this.queryStr.page) || 1;
        const resultsPerPage = Number(this.queryStr.limit) || 15;

        const skip = resultsPerPage * (currentPage - 1);

        this.query = this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
}
 
export default APIFunctionality