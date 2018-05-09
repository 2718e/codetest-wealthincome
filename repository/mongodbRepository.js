/**
* This section of the code handles querying data. The intent is to use a "repository pattern"
* to abstract the store.
*
* this particular implementation uses mongodb for storage
*/

class MongodbRepository {
  /**
    * creates a new data access object based on mongodb
    *
    * @param {the database connection as returned from a call MongoClient.db} connection
    */
  constructor (connection) {
    const db = connection
    const getDataPromise = function (start, end, projection, mapping) {
      return db.collection('wealthincome')
        .find({ _id: { $gte: start, $lte: end } })
        .project(projection)
        .toArray().then(mapping)
    }
    this.setData = (rows) => {
      const collection = db.collection('wealthincome')
      const docs = rows.map(row => {
        return {
          _id: row[0],
          incomeTop10: row[1],
          wealthTop10: row[2],
          incomeBottom50: row[3],
          wealthBottom50: row[4]
        }
      })
      collection.deleteMany({}).then(() => {
        collection.insertMany(docs)
      })
    }
    this.getTop10 = (start, end) => {
      return getDataPromise(start, end,
        { _id: 1, incomeTop10: 1, wealthTop10: 1 },
        docs => {
          return {
            period: docs.map(doc => doc._id),
            income: docs.map(doc => doc.incomeTop10),
            wealth: docs.map(doc => doc.wealthTop10)
          }
        })
    }
    this.getBottom50 = (start, end) => {
      return getDataPromise(start, end,
        { _id: 1, incomeBottom50: 1, wealthBottom50: 1 },
        docs => {
          return {
            period: docs.map(doc => doc._id),
            income: docs.map(doc => doc.incomeBottom50),
            wealth: docs.map(doc => doc.wealthBottom50)
          }
        })
    }
    this.getIncome = (start, end) => {
      return getDataPromise(start, end,
        { _id: 1, incomeTop10: 1, incomeBottom50: 1 },
        docs => {
          return {
            period: docs.map(doc => doc._id),
            top10: docs.map(doc => doc.incomeTop10),
            bottom50: docs.map(doc => doc.incomeBottom50)
          }
        })
    }
    this.getWealth = (start, end) => {
      return getDataPromise(start, end,
        { _id: 1, wealthTop10: 1, wealthBottom50: 1 },
        docs => {
          return {
            period: docs.map(doc => doc._id),
            top10: docs.map(doc => doc.wealthTop10),
            bottom50: docs.map(doc => doc.wealthBottom50)
          }
        })
    }
  }
}

module.exports = MongodbRepository
