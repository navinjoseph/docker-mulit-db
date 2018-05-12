import { Model } from 'objection'

// Person model.
export default class History extends Model {
  static tableName = 'history';

  static idColumn = 'id';

  $beforeInsert () {
    this.createdAt = new Date().toISOString()
  }

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }

  static get jsonSchema () {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        ticker: { type: 'string', minLength: 1, maxLength: 255 },
        usdPrice: { type: 'float' }
      }
    }
  }
}
