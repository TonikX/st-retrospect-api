import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLField } from 'graphql';
import { ResolverContextBase } from '../types/graphql';
import { FieldsWithDataLoader } from '../dataLoaders';
import { ObjectId } from 'mongodb';

/**
 * Arguments for DataLoaderDirective
 */
interface DataLoaderDirectiveArgs {
  /**
   * Name of needed DataLoader
   */
  dataLoaderName: FieldsWithDataLoader;

  /**
   * Name of field with data for DataLoader
   */
  fieldName: string;
}

/**
 * Directive for data loaders
 */
export default class DataLoaderDirective extends SchemaDirectiveVisitor {
  /**
   * @param field - GraphQL field definition
   */
  visitFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLField<any, any> | void | null {
    const { dataLoaderName, fieldName } = this.args as DataLoaderDirectiveArgs;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field.resolve = async (parent, args, context: ResolverContextBase): Promise<any> => {
      const fieldValue = parent[fieldName];

      if (fieldValue instanceof Array) {
        if (!fieldValue) {
          return [];
        }

        return context.dataLoaders[dataLoaderName].loadMany(
          (fieldValue.filter(Boolean) as ObjectId[])
            .map(id => id.toString()).filter(Boolean)
        );
      } else {
        if (!fieldValue) {
          return null;
        }

        const value = await context.dataLoaders[dataLoaderName].load(fieldValue.toString());

        if (!value) {
          return null;
        }

        return value;
      }
    };
  }
}
