import { Model } from 'objection'

export default class Source extends Model {
  static tableName = 'source';

  static idColumn = 'id';

  static get jsonSchema () {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' }
      }
    }
  }
}
