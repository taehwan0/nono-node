const db = require('./db.js')
const connection = db.connection
const moment = db.moment

/*
입출고 기록 생성
입출고 기록 수정
문서별 입출고 기록 조회
물품별 입출고 기록 조회
입출고 기록 삭제
*/

// 입출고 기록 생성
// stock 은 자동 생성 해야함
const createRecord = (docsCode, prdCode, prdName, quantity, stock) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into Record (docsCode, prdCode, prdName, quantity, stock) values ('${docsCode}', '${prdCode}', '${prdName}', '${quantity}', '${stock}')`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('createRecord')
        resolve('createRecord')
      }
    )
  })
}

// 입출고 기록 수정
const updateRecord = (docsCode, prdCode, prdName, quantity, stock) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update Record set prdName = '${prdName}', quantity = '${quantity}', stock = '${stock}' where docsCode = '${docsCode}' and prdCode = '${prdCode}'`,
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

// 문서별 입출고 기록 조회
const readDocumentRecord = (docsCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select R.docsCode, R.prdCode, R.prdName, R.quantity, R.stock, D.date, D.writer, D.docsType from Record R, Document D where R.docsCode = ${docsCode} and R.docsCode = D.docsCode order by date desc;`,
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

// 물품별 입출고 기록 조회
const readProductRecord = (prdCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select R.docsCode, R.prdCode, R.prdName, R.quantity, R.stock, D.date, D.writer, D.docsType from Record R, Document D where R.prdCode = '${prdCode}' and R.docsCode = D.docsCode order by date desc, D.docsCode desc`,
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

// 입출고 기록 삭제
const deleteRecord = (docsCode, prdCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `delete from Record where docsCode = '${docsCode}' and prdCode = '${prdCode}'`,
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

// docsCode에 종속된 record 전체 삭제
// stock 관리로 쓸 일 없어짐
const deleteRecordAll = (docsCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `delete from Record where docsCode = '${docsCode}'`,
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

const readRecord = (docsCode, prdCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from Record where docsCode = '${docsCode}' and prdCode = '${prdCode}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(result[0])
      }
    )
  })
}

// 제일 최근 record의 stock 불러오기
// 이 날짜 이후의 모든 record stock에 영향 주기

// 생성하려는 날짜 이하의 최근 record Stock,
// 생성하려는 날짜보다 빠른 날자의 record가 없다면, 이후 날짜 중 가장 빠른 날짜의 record 가져오기로,,
const readRecordRecent = (prdCode, date) => {
  return new Promise((resolve, reject) => {
    const jsonObject = new Object()
    let query = `
    select D.date date, R.stock stock, R.quantity quantity, D.docsType docsType from Record R, Document D
    where R.docsCode = D.docsCode and
    R.prdCode = '${prdCode}' and 
    D.date <= '${date}' order by D.date desc, D.docsCode desc limit 1
    `
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      // 이전의 RECORD가 없는 CASE, 이후의 RECORD를 찾아보는 동작
      if (result == 0) {
        let innerquery = `
        select D.date date, R.stock stock, R.quantity quantity, D.docsType docsType from Record R, Document D
        where R.docsCode = D.docsCode and
        R.prdCode = '${prdCode}' and 
        '${date}' <= D.date order by D.date desc, D.docsCode desc limit 1
        `
        connection.query(innerquery, (err, innerResult) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          // 이후 데이터도 존재하지 않는다면
          if (innerResult == 0) {
            jsonObject.type = 'prd'
            resolve(jsonObject)
          } else {
            // 이후 데이터가 존재 한다면
            jsonObject.type = 'after'
            jsonObject.result = innerResult[0]
            resolve(jsonObject)
          }
        })
      } else {
        // 생성하려는 날짜 이전의 데이터가 존재 하는 경우
        jsonObject.type = 'before'
        jsonObject.result = result[0]
        resolve(jsonObject)
      }
    })
  })
}

// 해당 날짜 이후의 모든 record의 stock에 + 혹은 -
// 생성된 레코드를 특정 해야함... 그 레코드의 docsCode 이상
const stockRecord = (prdCode, quantity, docsType, date, checkedTime) => {
  return new Promise((resolve, reject) => {
    if (docsType == 'output') {
      quantity = quantity * -1
    }
    let query = `    
    update Record INNER JOIN Document on Record.docsCode = Document.docsCode
    set Record.stock = Record.stock + ${quantity}
    where Record.prdCode = '${prdCode}' and
    (Document.date > '${date}' OR (Document.date = '${date}' and Document.checkedTime > '${checkedTime}' ))
    `
    console.log(checkedTime)
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      resolve(result)
    })
  })
}

module.exports = {
  createRecord,
  updateRecord,
  readRecord,
  readDocumentRecord,
  readProductRecord,
  readRecordRecent,
  stockRecord,
  deleteRecord,
  deleteRecordAll,
}
