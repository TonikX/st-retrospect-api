import { Db } from 'mongodb';
import { GraphQLResolveInfo } from 'graphql';

/**
 * Resolver's Context argument
 */
export interface ResolverContextBase {
  /**
   * MongoDB connection to make queries
   */
  readonly db: Db;
}

/**
 * Describes the signature of type resolvers
 */
export interface BaseTypeResolver<
    ParentType = undefined,
    ResolverContext extends ResolverContextBase = ResolverContextBase
  > {
  [key: string]: ResolverFunction<ParentType, ResolverContext>;
}

/**
 * Resolver function
 * @param parent - the object that contains the result returned from the resolver on the parent field
 * @param arg - resolver's args
 * @param context - resolver's context
 * @param info - contains information about the execution state of the query
 */
export type ResolverFunction<ParentType, ResolverContext> = (
  parent: ParentType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arg: any,
  context: ResolverContext,
  info: GraphQLResolveInfo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;