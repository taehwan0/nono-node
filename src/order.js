const db = require('./db.js')
const connection = db.connection
const record = require('./record.js')
const product = require('./product.js')
const document = require('./document.js')

/*
json 의 docs 생성 record 생성 prd에 영향 주기
*/

// connection.query('start transaction')
// const createDocument = (docsType, companyName, shippingDate, numOfPrd) => {
docsConfig = ['input', '햄토리공장', '20211225', '5']
// console.log(docsConfig[0], docsConfig[1], docsConfig[2], docsConfig[3])
let result = async () =>
  await document.createDocument(
    docsConfig[0],
    docsConfig[1],
    docsConfig[2],
    docsConfig[3]
  )
//connection.query('commit')
