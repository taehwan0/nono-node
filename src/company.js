const db = require('./db.js')
const connection = db.connection

/*
거래처 생성
거래처 수정
거래처 전체 조회
거래처 1개 조회
거래처 활성화 여부 조회
거래처 활성 비활성 토글
*/

// 거래처 생성
const createCompany = (companyName, companyCategory, companyType) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into Company (companyName, companyCategory, companyType) values ('${companyName}', '${companyCategory}', '${companyType}')`,
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

// 거래처 수정
const updateCompany = (
  companyCode,
  companyName,
  companyCategory,
  companyType,
  activation
) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update Company set companyName = '${companyName}', companyCategory = '${companyCategory}', companyType = '${companyType}', activation = '${activation}' where companyCode = ${companyCode}`,
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

// 거래처 상태 확인 (내부용)
const checkActivationCompany = (companyCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from Company where companyCode = ${companyCode}`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result == 0) {
          console.log('Error : No match Company')
          reject(new Error('No match Company'))
        }
        resolve(result[0].activation)
      }
    )
  })
}

// 거래처 activation 토글
const setCompanyState = (companyCode, state) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update Company set activation = ${state} where companyCode = ${companyCode}`,
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

// 모든 거래처 정보 불러오기
const readCompany = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select companyCode, companyName, companyType, companyCategory, activation from Company`,
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

// 활성화 되어 있는 company 목록
const readCompanyActive = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select companyCode, companyName, companyType, companyCategory, activation from Company where activation = 1`,
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

// 거래처 1개 조회
const readCompanyInfo = (companyCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select companyCode, companyName, companyType, companyCategory, activation from Company where companyCode = ${companyCode}`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        const jsonObject = new Object()
        jsonObject.data = result[0]
        resolve(jsonObject)
      }
    )
  })
}

// 거래처 정보 삭제
const deleteCompany = (companyCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `delete from Company where companyCode = ${companyCode}`,
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

module.exports = {
  createCompany,
  updateCompany,
  setCompanyState,
  checkActivationCompany,
  readCompany,
  readCompanyActive,
  readCompanyInfo,
  deleteCompany,
}
