const db = require('./db.js')
const connection = db.connection

/*
상품 정보 생성
상품 정보 수정
상품 전체 조회
상품 1개 조회
상품 활성화 여부 조회
상품 활성 비활성 토글
상품 삭제
*/

const createProduct = (
  prdCode,
  prdName,
  prdNameDetail,
  barcode,
  category,
  maker,
  standard,
  storageMethod,
  stock
) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into Product (
        prdCode,
        prdName,
        prdNameDetail,
        barcode,
        category,
        maker,
        standard,
        storageMethod,
        stock
        ) values ('${prdCode}', '${prdName}', '${prdNameDetail}', '${barcode}', '${category}', '${maker}', '${standard}', '${storageMethod}', ${stock})`,
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

// 다른 update들과 다르게 prdCode 또한 수정 가능하게 작성해야함
// prdCode, newPrdCode
const updateProduct = (
  prdCode,
  prdName,
  prdNameDetail,
  barcode,
  category,
  maker,
  standard,
  storageMethod,
  stock,
  activation
) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update Product set prdName = '${prdName}', prdNameDetail ='${prdNameDetail}',
    barcode = '${barcode}', category = '${category}', maker = '${maker}', standard = '${standard}', storageMethod = '${storageMethod}',
    stock = '${stock}', activation = '${activation}' where prdCode = '${prdCode}'`,
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

// 상품 상태 확인 (내부용)
const checkActivationProduct = (prdCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from Product where prdCode = '${prdCode}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result == 0) {
          console.log('Error : No match Product')
          reject(new Error('No match Product'))
        }
        resolve(result[0].activation)
      }
    )
  })
}

// 상품 activation 토글
const setProductState = (prdCode, state) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update Product set activation = ${state} where prdCode = '${prdCode}'`,
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

// 모든 상품 정보 불러오기
// 모바일에서는 prdNameDetail 불러올 필요 없음?
const readProduct = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select
      prdCode,
      prdName,
      prdNameDetail,
      barcode,
      category,
      maker,
      standard,
      storageMethod,
      stock
      from Product
      where deleted = 0`,
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

// 활성화 되어 있는 Product만 반환
const readProductActive = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select
      prdCode,
      prdName,
      prdNameDetail,
      barcode,
      category,
      maker,
      standard,
      storageMethod,
      stock,
      activation
      from Product
      where deleted = 0`,
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

// 1개 상품 정보 불러오기
// 모바일에서는 prdNameDetail 불러올 필요 없음?
const readProductInfo = (prdCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select
      prdCode,
      prdName,
      prdNameDetail,
      barcode,
      category,
      maker,
      standard,
      storageMethod,
      stock from Product 
      where prdCode = '${prdCode}'`,
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

// 상품 정보 삭제
const deleteProduct = (prdCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `delete from Product where prdCode = ${prdCode}`,
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

const stockProduct = (prdCode, quantity, docsType) => {
  return new Promise((resolve, reject) => {
    if (docsType == 'output') {
      quantity = quantity * -1
    }
    console.log(
      `update Product set stock = stock + ${quantity} where prdCode = '${prdCode}'`
    )
    connection.query(
      `update Product set stock = stock + ${quantity} where prdCode = '${prdCode}'`,
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

module.exports = {
  createProduct,
  updateProduct,
  checkActivationProduct,
  setProductState,
  readProduct,
  readProductActive,
  readProductInfo,
  deleteProduct,
  stockProduct,
}
