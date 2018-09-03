import { Model } from 'objection'
import Source from './source'

export default class Price extends Model {
  static tableName = 'price'

  static idColumn = 'id'

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
        timestamp: { type: 'timestamp' },
        usdPrice: { type: 'float' },
        coinId: { type: 'integer' },
        sourceId: { type: 'integer' }
      }
    }
  }

  static relationMappings = {
    source: {
      relation: Model.BelongsToOneRelation,
      modelClass: Source,
      join: {
        from: 'price.sourceId',
        to: 'source.id'
      }
    }
  }
}
