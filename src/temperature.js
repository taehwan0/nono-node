const db = require('./db.js')
const connection = db.connection
const moment = db.moment

/*
유저의 오늘 날짜 저장하기
해당 유저의 오늘 기록 불러오기 / 오늘 검사 실시했는지 확인하기 위함
해당 유저의 N년 M월 기록 불러오기
*/

const createTemperatureRecord = (userCode, temperature) => {
  return new Promise((resolve, reject) => {
    const today = moment().format('YYYYMMDD')
    connection.query(
      `insert into TemperatureRecord (userCode, temperature, checkedDate) values ('${userCode}', ${temperature}, ${today})`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve('SUCCESS')
      }
    )
  })
}

const readTemperatureRecordToday = (userCode) => {
  return new Promise((resolve, reject) => {
    const today = moment().format('YYYYMMDD')
    connection.query(
      `select userCode, temperature, checkedDate from TemperatureRecord where userCode = '${userCode}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(result)
      }
    )
  })
}

const readTemperatureRecord = (userCode, Year, Month) => {
  return new Promise((resolve, reject) => {
    const startDate = YYYYMM00
    const endDate = YYYYMM31
    connection.query(
      `select userCode, temperature, checkedDate from TemperatureRecord where userCode = '${userCode}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(result)
      }
    )
  })
}
