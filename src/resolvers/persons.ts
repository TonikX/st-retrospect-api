import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';

/**
 * Supported languages for data
 */
enum Languages {
  RU = 'RU',
  EN = 'EN'
}

/**
 * Multilingual person fields
 */
const multilingualPersonFields = [
  'firstName',
  'lastName',
  'patronymic',
  'pseudonym',
  'profession',
  'description'
];

/**
 * Object storing strings in different languages
 */
interface MultilingualString {
  [key: string]: string;
}

/**
 * Get only queried languages
 * @param entity - entity to filter
 * @param languages - languages to select
 * @param multilingualFields - fields to filter
 */
function filterEntityFields(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entity: { [key: string]: any },
  languages: Languages[],
  multilingualFields: string[]
): void {
  multilingualFields.forEach((field: string) => {
    const fieldValue = (entity[field] as MultilingualString) || {};

    entity[field] = {};
    languages.forEach((lang: string) => {
      const langLowerCase = lang.toLowerCase();

      entity[field][langLowerCase] = fieldValue[langLowerCase] || null;
    });
  });
}

const Query: BaseTypeResolver = {
  async person(parent, { id, languages }: { id: string; languages: Languages[] }, { db }) {
    const person = await db.collection('persons').findOne({
      _id: new ObjectId(id)
    });

    if (!person) {
      return null;
    }

    filterEntityFields(person, languages, multilingualPersonFields);

    // @todo move to directive
    person.id = person._id;
    return person;
  },
  async persons(parent, { languages }: {languages: Languages[]}, { db }) {
    const persons = await db.collection('persons').find({}).toArray();

    persons.map((person) => {
      filterEntityFields(person, languages, multilingualPersonFields);
      person.id = person._id;
      return person;
    });
    return persons;
  }
};

export default {
  Query
};