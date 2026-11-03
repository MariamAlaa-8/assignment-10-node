import mongoose, {Model,QueryFilter, QueryOptions,ProjectionType,UpdateQuery,UpdateWriteOpResult,CreateOptions,HydratedDocument,DeleteResult,UpdateWithAggregationPipeline,PopulateOptions,AnyKeys,FlattenMaps,MongooseUpdateQueryOptions,} from "mongoose";
import { IPaginate } from "../interface";

export abstract class DatabaseRepository<TRawDocType> {
  constructor(protected model: Model<TRawDocType>) {}

  //  CREATE 
  async create({
    data,
  }: {
    data: AnyKeys<TRawDocType>;
  }): Promise<HydratedDocument<TRawDocType>>;

  async create({
    data,
    options,
  }: {
    data: AnyKeys<TRawDocType>[];
    options?: CreateOptions;
  }): Promise<HydratedDocument<TRawDocType>[]>;

  async create({
    data,
    options,
  }: {
    data: AnyKeys<TRawDocType> | AnyKeys<TRawDocType>[];
    options?: CreateOptions;
  }): Promise<HydratedDocument<TRawDocType> | HydratedDocument<TRawDocType>[]> {
    return await this.model.create(data as any, options);
  }

  async createOne({
    data,
    options = {},
  }: {
    data: AnyKeys<TRawDocType>;
    options?: CreateOptions;
  }): Promise<HydratedDocument<TRawDocType>> {
    const [doc] = await this.create({ data: [data], options });
    return doc as HydratedDocument<TRawDocType>;
  }

  //  FIND ONE 
  async findOne({
    filter,
    projection,
    options,
  }: {
    filter: QueryFilter<TRawDocType>;
    projection?: ProjectionType<TRawDocType> | null | undefined;
    options?: (QueryOptions<TRawDocType> & { lean?: false }) | null | undefined;
  }): Promise<HydratedDocument<TRawDocType> | undefined | null>;

  async findOne({
    filter,
    projection,
    options,
  }: {
    filter: QueryFilter<TRawDocType>;
    projection?: ProjectionType<TRawDocType> | null | undefined;
    options?: (QueryOptions<TRawDocType> & { lean: true }) | null | undefined;
  }): Promise<FlattenMaps<TRawDocType> | undefined | null>;

  async findOne({
    filter = {},
    projection,
    options,
  }: {
    filter?: QueryFilter<TRawDocType>;
    projection?: ProjectionType<TRawDocType> | null | undefined;
    options?: (QueryOptions<TRawDocType> & { lean?: boolean }) | null | undefined;
  }): Promise<HydratedDocument<TRawDocType> | FlattenMaps<TRawDocType> | undefined | null> {
    let query = this.model.findOne(filter, projection);

    if (options?.populate) {
      query = query.populate(options.populate as PopulateOptions[]);
    }

    if (options?.lean) {
      return (await query.lean().exec()) as FlattenMaps<TRawDocType> | null;
    }

    return (await query.exec()) as HydratedDocument<TRawDocType> | null;
  }

  //  FIND BY ID 
  async findById({
    id,
    projection,
    options,
  }: {
    id: mongoose.Types.ObjectId;
    projection?: ProjectionType<TRawDocType> | null | undefined;
    options?: (QueryOptions<TRawDocType> & { lean?: false }) | null | undefined;
  }): Promise<HydratedDocument<TRawDocType> | undefined | null>;

  async findById({
    id,
    projection,
    options,
  }: {
    id: mongoose.Types.ObjectId;
    projection?: ProjectionType<TRawDocType> | null | undefined;
    options?: (QueryOptions<TRawDocType> & { lean: true }) | null | undefined;
  }): Promise<FlattenMaps<TRawDocType> | undefined | null>;

  async findById({
    id,
    projection,
    options,
  }: {
    id: mongoose.Types.ObjectId;
    projection?: ProjectionType<TRawDocType> | null | undefined;
    options?: (QueryOptions<TRawDocType> & { lean?: boolean }) | null | undefined;
  }): Promise<HydratedDocument<TRawDocType> | FlattenMaps<TRawDocType> | undefined | null> {
    let query = this.model.findById(id, projection);

    if (options?.populate) {
      query = query.populate(options.populate as PopulateOptions[]);
    }

    if (options?.lean) {
      return (await query.lean().exec()) as FlattenMaps<TRawDocType> | null;
    }

    return (await query.exec()) as HydratedDocument<TRawDocType> | null;
  }

  //  FIND 
  async find({
    filter = {},
    projection,
    options,
  }: {
    filter?: QueryFilter<TRawDocType>;
    projection?: ProjectionType<TRawDocType> | null | undefined;
    options?: (QueryOptions<TRawDocType> & { skip?: number; limit?: number }) | null | undefined;
  }): Promise<HydratedDocument<TRawDocType>[]> {
    let query = this.model.find(filter, projection);

    if (options?.select) {
      query = query.select(options.select);
    }
    if (options?.populate) {
      query = query.populate(options.populate as PopulateOptions[]);
    }
    if (options?.skip) {
      query = query.skip(options.skip);
    }
    if (options?.sort) {
      query = query.sort(options.sort as string);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.lean) {
      return (await query.lean().exec()) as unknown as HydratedDocument<TRawDocType>[];
    }

    return (await query.exec());
  }

  //  COUNT 
  async countDocuments({
    filter = {},
  }: {
    filter?: QueryFilter<TRawDocType>;
  }): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  //  PAGINATE 
  async paginate({
    filter = {},
    projection,
    options = {},
    page = 1,
    limit = 5,
  }: {
    filter?: QueryFilter<TRawDocType>;
    projection?: ProjectionType<TRawDocType> | null | undefined;
    options?: QueryOptions<TRawDocType>;
    page?: number;
    limit?: number;
  }): Promise<IPaginate<HydratedDocument<TRawDocType>>> {
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

  //  UPDATE 
  async updateOne({
    filter = {},
    update,
    options,
  }: {
    filter?: QueryFilter<TRawDocType>;
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline;
    options?: MongooseUpdateQueryOptions<TRawDocType> | null;
  }): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(
      filter,
      update as UpdateQuery<TRawDocType>,
      options ?? {}
    );
  }

  async updateMany({
    filter = {},
    update,
    options,
  }: {
    filter?: QueryFilter<TRawDocType>;
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline;
    options?: MongooseUpdateQueryOptions<TRawDocType> | null;
  }): Promise<UpdateWriteOpResult> {
    return await this.model.updateMany(
      filter,
      update as UpdateQuery<TRawDocType>,
      options ?? {}
    );
  }

  async findOneAndUpdate({
    filter = {},
    update,
    options,
  }: {
    filter?: QueryFilter<TRawDocType>;
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline;
    options?: QueryOptions<TRawDocType>;
  }): Promise<HydratedDocument<TRawDocType> | null> {
    return await this.model.findOneAndUpdate(
      filter,
      update as UpdateQuery<TRawDocType>,
      { returnDocument: "after", ...options }
    );
  }

  async findByIdAndUpdate({
    id,
    update,
    options,
  }: {
    id: mongoose.Types.ObjectId;
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline;
    options?: QueryOptions<TRawDocType>;
  }): Promise<HydratedDocument<TRawDocType> | null> {
    return await this.model.findByIdAndUpdate(
      id,
      update as UpdateQuery<TRawDocType>,
      { returnDocument: "after", ...options }
    );
  }

  //  DELETE 
  async deleteOne({
    filter = {},
  }: {
    filter?: QueryFilter<TRawDocType>;
  }): Promise<DeleteResult> {
    return await this.model.deleteOne(filter);
  }

  async deleteMany({
    filter = {},
  }: {
    filter?: QueryFilter<TRawDocType>;
  }): Promise<DeleteResult> {
    return await this.model.deleteMany(filter);
  }

  async findOneAndDelete({
    filter = {},
  }: {
    filter?: QueryFilter<TRawDocType>;
  }): Promise<HydratedDocument<TRawDocType> | null> {
    return await this.model.findOneAndDelete(filter);
  }

  async findByIdAndDelete({
    id,
  }: {
    id: mongoose.Types.ObjectId;
  }): Promise<HydratedDocument<TRawDocType> | null> {
    return await this.model.findByIdAndDelete(id);
  }
}