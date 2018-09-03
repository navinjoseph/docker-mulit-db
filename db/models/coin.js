import { Model } from 'objection'
import Price from './price'

export default class Coin extends Model {
  static tableName = 'coin'

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
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          unique: false,
          nullable: false
        },
        ticker: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          unique: true,
          nullable: false
        }
      }
    }
  }

  static relationMappings = {
    prices: {
      relation: Model.HasManyRelation,
      modelClass: Price,
      join: {
        from: 'coin.id',
        to: 'price.coinId'
      }
    }
  }
}
