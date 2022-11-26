const db = require('./db.js')
const connection = db.connection
const moment = require('moment')
const record = require('./record.js')
const user = require('./user.js')

let hello = async() => {
    let result = await db.staticQuery('select * from Record')
    console.log(result[0])
}

hello()