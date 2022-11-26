// // 테스트용 파일 추후 삭제 예정

const mysql = require('mysql')
const config = require('./config.js')

const moment = require('moment')
require('moment-timezone')
moment.tz.setDefault('Asia/Seoul')

const connection = mysql.createConnection(config)
connection.connect()

const staticQuery = (queryString) => {
  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, result) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      // console.log(result)
      resolve(result)
    })
  })
}

module.exports = {
  connection,
  moment,
  staticQuery,
}
