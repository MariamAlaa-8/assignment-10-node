"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
    async createOne({ data, options = {}, }) {
        const [doc] = await this.create({ data: [data], options });
        return doc;
    }
    async findOne({ filter = {}, projection, options, }) {
        let query = this.model.findOne(filter, projection);
        if (options?.populate) {
            query = query.populate(options.populate);
        }
        if (options?.lean) {
            return (await query.lean().exec());
        }
        return (await query.exec());
    }
    async findById({ id, projection, options, }) {
        let query = this.model.findById(id, projection);
        if (options?.populate) {
            query = query.populate(options.populate);
        }
        if (options?.lean) {
            return (await query.lean().exec());
        }
        return (await query.exec());
    }
    async find({ filter = {}, projection, options, }) {
        let query = this.model.find(filter, projection);
        if (options?.select) {
            query = query.select(options.select);
        }
        if (options?.populate) {
            query = query.populate(options.populate);
        }
        if (options?.skip) {
            query = query.skip(options.skip);
        }
        if (options?.sort) {
            query = query.sort(options.sort);
        }
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        if (options?.lean) {
            return (await query.lean().exec());
        }
        return (await query.exec());
    }
    async countDocuments({ filter = {}, }) {
        return await this.model.countDocuments(filter);
    }
    async paginate({ filter = {}, projection, options = {}, page = 1, limit = 5, }) {
        const skip = (page - 1) * limit;
        const count = await this.countDocuments({ filter });
        const pages = Math.ceil(count / limit);
        const docs = await this.find({
            filter,
            projection,
            options: { ...options, skip, limit },
        });
        return { count, limit, pages, currentPage: page, docs };
    }
    async updateOne({ filter = {}, update, options, }) {
        return await this.model.updateOne(filter, update, options ?? {});
    }
    async updateMany({ filter = {}, update, options, }) {
        return await this.model.updateMany(filter, update, options ?? {});
    }
    async findOneAndUpdate({ filter = {}, update, options, }) {
        return await this.model.findOneAndUpdate(filter, update, { returnDocument: "after", ...options });
    }
    async findByIdAndUpdate({ id, update, options, }) {
        return await this.model.findByIdAndUpdate(id, update, { returnDocument: "after", ...options });
    }
    async deleteOne({ filter = {}, }) {
        return await this.model.deleteOne(filter);
    }
    async deleteMany({ filter = {}, }) {
        return await this.model.deleteMany(filter);
    }
    async findOneAndDelete({ filter = {}, }) {
        return await this.model.findOneAndDelete(filter);
    }
    async findByIdAndDelete({ id, }) {
        return await this.model.findByIdAndDelete(id);
    }
}
exports.DatabaseRepository = DatabaseRepository;
