const db = require('./db.js')
const moment = db.moment
const connection = db.connection
/*
문서 작성
문서 수정
문서 삭제
문서 1개 조회
문서 월별 조회
문서 상태 확인 ( 내부용 )
문서 확인(state 1차 변경)
문서 확정 저장 (state 2차 변경)
*/

// 최초 생성시 checker null state default
const createDocument = (docsType, companyName, date, numOfPrd, writer) => {
  return new Promise((resolve, reject) => {
    let checkedTime = moment().format('YYYYMMDDHHmmss')
    connection.query(
      `insert into Document (
        docsType,
        companyName,
        date,
        numOfPrd,
        writer,
        checkedTime
        ) values ('${docsType}', '${companyName}', '${date}', '${numOfPrd}', '${writer}', '${checkedTime}')`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(checkedTime)
      }
    )
  })
}

// docsType 외의 정보로 docsCode 반환하기
const docsCode = (docsType, companyName, date, numOfPrd, writer) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select docsCode from Document where docsType = '${docsType}' and companyName = '${companyName}' and date ='${date}' and numOfPrd = '${numOfPrd}' and writer = '${writer}' order by docsCode desc`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result == 0) {
          console.log('select : row not found')
          reject(new Error('select : row not found'))
        }
        resolve(result[0].docsCode)
      }
    )
  })
}

// checker, state는 임의로 수정 불가능
// date는 문자열로 YYYYMMDD 형태 입력받음
const updateDocument = (docsCode, companyName, numOfPrd, writer) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update Document set companyName = '${companyName}',
      numOfPrd = '${numOfPrd}', writer = '${writer}' where docsCode = '${docsCode}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        // else if (result.changedRows == 0) {
        //   console.log('Error : changedRows = 0')
        //   reject(new Error('changedRows : 0'))
        // }
        // DOCS + RECORD 기능 사용 시 DOCS의 내용은 변함이 없을 수 있음
        resolve('SUCCESS')
      }
    )
  })
}

// 문서 상태 확인
const checkDocumentState = (docsCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from Document where docsCode = '${docsCode}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result == 0) {
          console.log('Error : No match docsCode')
          reject(new Error('No match docsCode'))
        }
        resolve(result[0].state)
      }
    )
  })
}

// 문서 체크
// 확인 시간은 서버에서 자동 생성
const checkDocument = (docsCode, checker) => {
  return new Promise((resolve, reject) => {
    let checkedTime = moment().format('YYYYMMDDHHmmss')
    connection.query(
      `update Document set checker = '${checker}', checkedTime = '${checkedTime}', state = 'check' where docsCode = '${docsCode}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result.changedRows == 0) {
          console.log('Error : changedRows = 0')
          reject(new Error('changedRows : 0'))
        }
        resolve('SUCCESS')
      }
    )
  })
}

// 문서 확정
const confirmDocument = (docsCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update Document set state = 'confirm' where docsCode = '${docsCode}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result.changedRows == 0) {
          console.log('Error : changedRows = 0')
          reject(new Error('changedRows : 0'))
        }
        resolve('SUCCESS')
      }
    )
  })
}

// 입력 연/월 문서 불러오기
const readDocument = (year, month) => {
  return new Promise((resolve, reject) => {
    let startDate = new Date(`${year}, ${month}, 1`)
    let nextMonth = parseInt(month) + 1
    let nextYear = parseInt(year) + 1
    let endDate = new Date(`${year}, ${nextMonth}, 1`)
    if (month == 12) {
      endDate = new Date(`${nextYear}, 1, 1`)
    }

    startDate = moment(startDate).format('YYYYMMDD')
    endDate = moment(endDate).format('YYYYMMDD')
    console.log(startDate)
    console.log(endDate)
    connection.query(
      `select
      *
      from Document
      where date >= ${startDate} and date < ${endDate}`,
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

// 1개 문서 정보 불러오기
const readDocumentInfo = (docsCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select
      * from Document 
      where docsCode = '${docsCode}'`,
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

// 최초 생성시 checker null state default
const deleteDocument = (docsCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `delete from Document where docsCode = ${docsCode}`,
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

/*
문서 작성
문서 수정
문서 삭제
문서 1개 조회
문서 월별 조회
문서 상태 확인 ( 내부용 )
문서 확인(state 1차 변경)
문서 확정 저장 (state 2차 변경)
*/

module.exports = {
  createDocument,
  updateDocument,
  readDocument,
  readDocumentInfo,
  checkDocument,
  checkDocumentState,
  confirmDocument,
  deleteDocument,
  docsCode,
}
