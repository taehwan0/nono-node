// @ts-check
const express = require('express')
const http = require('http')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const notice = require('./notice.js')
const user = require('./user.js')
const company = require('./company.js')
const product = require('./product.js')
const document = require('./document.js')
const record = require('./record.js')
const connection = require('./db.js')
const { type } = require('os')

// const PORT = 3000 // local
const PORT = process.env.PORT || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello, world')
})

//
// NOTICE
//

app.post('/notice/create', async (req, res) => {
  let title = req.body.title
  let post = req.body.post
  let writer = req.body.writer
  // let registerDate = req.body.registerDate 서버 시간 자동 등록
  let focus = req.body.focus
  // focus 미전달시 0으로 간주
  // let noticeCode = req.body.noticeCode

  let result = await notice.createNotice(title, post, writer, focus)
  console.log(result)
  res.json(result)
})

// noticeCode / writer 일치하면 title, post, focus 변경
app.post('/notice/update', async (req, res) => {
  let noticeCode = req.body.noticeCode
  let title = req.body.title
  let post = req.body.post
  let writer = req.body.writer
  let focus = req.body.focus

  let result = await notice.updateNotice(noticeCode, writer, title, post, focus)
  console.log(result)
  res.json(result)
})

// post 포함
app.get('/notice/list', async (req, res) => {
  let result = await notice.readNoticeInfoAll()
  console.log(result)
  res.json(result)
})

// 1개 포스트 포함 전부
app.post('/notice/info', async (req, res) => {
  let noticeCode = req.body.noticeCode
  let result = await notice.readNoticeInfo(noticeCode)
  console.log(result)
  res.json(result)
})
// 최근 3개 불러오기
app.get('/notice/recent', async (req, res) => {
  let result = await notice.readNoticeRecent()
  console.log(result)
  res.json(result)
})
// 중요 공지 1개 불러오기
app.get('/notice/focus', async (req, res) => {
  let result = await notice.readNoticeFocus()
  console.log(result)
  res.json(result)
})
// 코드에 해당하는  공지사항 삭제하기
app.post('/notice/delete', async (req, res) => {
  let noticeCode = req.body.noticeCode
  let result = await notice.deleteNotice(noticeCode)
  console.log(result)
  res.json(result)
})

//
// USER
//

app.post('/user/create', async (req, res) => {
  let userName = req.body.userName
  let userPW = req.body.userPW
  let grade = req.body.grade
  let result = await user.createUser(userName, userPW, grade)
  console.log(result)
  res.json(result)
})

app.post('/user/update', async (req, res) => {
  let userCode = req.body.userCode
  let userName = req.body.userName
  let userPW = req.body.userPW
  let grade = req.body.grade
  let activation = req.body.activation
  let result = await user.updateUser(
    userCode,
    userName,
    userPW,
    grade,
    activation
  )
  console.log(result)
  res.json(result)
})

app.post('/user/activation', async (req, res) => {
  let userCode = req.body.userCode
  let state = await user.checkActivationUser(userCode)
  let result = await user.setUserState(userCode, !state)

  console.log(result)
  res.json(result)
})

app.get('/user/list', async (req, res) => {
  let result = await user.readUser()
  console.log(result)
  res.json(result)
})

app.get('/user/list/active', async (req, res) => {
  let result = await user.readUserActive()
  console.log(result)
  res.json(result)
})

app.post('/user/info', async (req, res) => {
  let userCode = req.body.userCode
  let result = await user.readUserInfo(userCode)
  console.log(result)
  res.json(result)
})

app.post('/user/verify', async (req, res) => {
  let userCode = req.body.userCode
  let grade = req.body.grade
  let result = await user.verifyUser(userCode, grade)
  res.json(result)
})

// 유저 로그인 0 반환시 아이디가 없거나 비밀번호가 틀림
// -1 반환 시 activation False 상태
app.post('/user/login', async (req, res) => {
  let userName = req.body.userName
  let userPW = req.body.userPW
  let result = await user.loginUser(userName, userPW)
  console.log(result)
  res.json(result)
})

app.post('/user/delete', async (req, res) => {
  let userCode = req.body.userCode
  let result = await user.deleteUser(userCode)
  console.log(result)
  res.json(result)
})

//
// COMPANY
//

app.post('/company/create', async (req, res) => {
  let companyName = req.body.companyName
  let companyCategory = req.body.companyCategory
  let companyType = req.body.companyType
  let result = await company.createCompany(
    companyName,
    companyCategory,
    companyType
  )
  console.log(result)
  res.json(result)
})

app.post('/company/update', async (req, res) => {
  let companyCode = req.body.companyCode
  let companyName = req.body.companyName
  let companyCategory = req.body.companyCategory
  let companyType = req.body.companyType
  let activation = req.body.activation
  let result = await company.updateCompany(
    companyCode,
    companyName,
    companyCategory,
    companyType,
    activation
  )
  console.log(result)
  res.json(result)
})

app.post('/company/activation', async (req, res) => {
  let companyCode = req.body.companyCode
  let state = await company.checkActivationCompany(companyCode)
  let result = await company.setCompanyState(companyCode, !state)

  console.log(result)
  res.json(result)
})

app.get('/company/list', async (req, res) => {
  let result = await company.readCompany()
  console.log(result)
  res.json(result)
})

app.get('/company/list/active', async (req, res) => {
  let result = await company.readCompanyActive()
  console.log(result)
  res.json(result)
})

app.post('/company/info', async (req, res) => {
  let companyCode = req.body.companyCode
  let result = await company.readCompanyInfo(companyCode)
  console.log(result)
  res.json(result)
})

app.post('/company/delete', async (req, res) => {
  let companyCode = req.body.companyCode
  let result = await company.deleteCompany(companyCode)
  console.log(result)
  res.json(result)
})

//
// PRODUCT
//

app.post('/prd/create', async (req, res) => {
  let prdCode = req.body.prdCode
  let prdName = req.body.prdName
  let prdNameDetail = req.body.prdNameDetail
  let barcode = req.body.barcode
  let category = req.body.category
  let maker = req.body.maker
  let standard = req.body.standard
  let storageMethod = req.body.storageMethod
  let stock = req.body.stock
  let result = await product.createProduct(
    prdCode,
    prdName,
    prdNameDetail,
    barcode,
    category,
    maker,
    standard,
    storageMethod,
    stock
  )
  // 최초 record 강제 생성
  await record.createRecord(124, prdCode, prdName, 0, stock)
  console.log(result)
  res.json(result)
})

app.post('/prd/update', async (req, res) => {
  let prdCode = req.body.prdCode
  let prdName = req.body.prdName
  let prdNameDetail = req.body.prdNameDetail
  let barcode = req.body.barcode
  let category = req.body.category
  let maker = req.body.maker
  let standard = req.body.standard
  let storageMethod = req.body.storageMethod
  let stock = req.body.stock
  let activation = req.body.activation
  let result = await product.updateProduct(
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
  )
  console.log(result)
  res.json(result)
})

app.post('/prd/activation', async (req, res) => {
  let prdCode = req.body.prdCode
  let state = await product.checkActivationProduct(prdCode)
  let result = await product.setProductState(prdCode, !state)

  console.log(result)
  res.json(result)
})

app.get('/prd/list', async (req, res) => {
  let result = await product.readProduct()
  console.log(result)
  res.json(result)
})

app.get('/prd/list/active', async (req, res) => {
  let result = await product.readProductActive()
  console.log(result)
  res.json(result)
})

app.post('/prd/info', async (req, res) => {
  let prdCode = req.body.prdCode
  let result = await product.readProductInfo(prdCode)
  console.log(result)
  res.json(result)
})

app.post('/prd/delete', async (req, res) => {
  let prdCode = req.body.prdCode
  let result = await product.deleteProduct(prdCode)
  console.log(result)
  res.json(result)
})

//
// DOCUMENT
//

app.get('/test', async (req, res) => {
  let stock = await record.readRecordRecent('11', '2021-12-03')
  console.log(stock)
  res.json(stock)
})

// docs, record, prd + Result는 해당하는 테이블을 다루는 쿼리가 에러가 나는지 확인하기 위한 변수
app.post('/docs/create', async (req, res) => {
  console.log('called')
  let jsonObject = req.body
  connection.staticQuery(`start transaction`)
  // 문서를 생성
  let docsResult = await document.createDocument(
    jsonObject.docsType,
    jsonObject.companyName,
    jsonObject.date,
    jsonObject.numOfPrd,
    jsonObject.writer
  )
  // 생성된 문서의 번호를 가져옴 ( 번호는 db에서 자동 생성됨 )
  let docsCode = await document.docsCode(
    jsonObject.docsType,
    jsonObject.companyName,
    jsonObject.date,
    jsonObject.numOfPrd,
    jsonObject.writer
  )
  let loop = 0
  let recordResult
  let recordUpdateResult
  let prdResult
  let recordRecentResult
  let docsTypeSwitch = 1
  // 문서의 input / output 로 quantity +, - 판단
  if (jsonObject.docsType == 'output') {
    docsTypeSwitch = docsTypeSwitch * -1
  }
  while (loop < jsonObject.list.length) {
    // 최근 Record의 스톡 가져오기
    // 최근 Record가 존재하지 않는다면, prdStock으로 대체
    recordRecentResult = await record.readRecordRecent(
      jsonObject.list[loop].prdCode,
      jsonObject.date
    )
    if(recordRecentResult.type == 'before') {
    console.log(recordRecentResult)
    recordRecentResult.stock = recordRecentResult.result.stock
    }
    else if (recordRecentResult.type == 'prd') {
      let productInfo = await product.readProductInfo(
        jsonObject.list[loop].prdCode
      )
      recordRecentResult.stock = productInfo.data.stock
    } else if (recordRecentResult.type == 'after') {
      if (recordRecentResult.result.docsType == 'input') {
        recordRecentResult.stock =
          recordRecentResult.result.stock - recordRecentResult.result.quantity
      } else {
        recordRecentResult.stock =
          recordRecentResult.result.stock + recordRecentResult.result.quantity
      }
    }
    
    // Record 문서 생성
    recordResult = await record.createRecord(
      docsCode,
      jsonObject.list[loop].prdCode,
      jsonObject.list[loop].prdName,
      jsonObject.list[loop].quantity,
      recordRecentResult.stock + docsTypeSwitch * jsonObject.list[loop].quantity
    )
    // 위 데이터 이후 날짜의 record가 존재한다면 record Stock 관리
    recordUpdateResult = await record.stockRecord(
      jsonObject.list[loop].prdCode,
      jsonObject.list[loop].quantity,
      jsonObject.docsType,
      jsonObject.date,
      docsResult
    )

    // Product Stcok 관리
    prdResult = await product.stockProduct(
      jsonObject.list[loop].prdCode,
      jsonObject.list[loop].quantity,
      jsonObject.docsType
    )
    if (
      recordResult == Error ||
      prdResult == Error ||
      recordUpdateResult == Error
    ) {
      await connection.staticQuery('rollback')
      break
    }
    loop++
  }
  if (
    recordResult == Error ||
    prdResult == Error ||
    recordUpdateResult == Error ||
    docsResult == Error
  ) {
    await connection.staticQuery('rollback')
    console.log('ERROR')
    res.json('ERROR')
  } else {
    await connection.staticQuery('commit')
    console.log('SUCCESS')
    res.json('SUCCESS')
  }
})

app.post('/docs/update', async (req, res) => {
  let jsonObject = req.body
  connection.staticQuery(`start transaction`)
  let docsResult = await document.updateDocument(
    jsonObject.docsCode,
    jsonObject.companyName,
    jsonObject.numOfPrd,
    jsonObject.writer
  )
  let docsInfo = await document.readDocumentInfo(jsonObject.docsCode)
  let docsTypeSwitch = 1
  if (docsInfo.docsType == 'output') {
    docsTypeSwitch = docsTypeSwitch * -1
  }
  let loop = 0
  let recordResult
  let prdResult
  let recordInfo
  let recordUpdateResult
  while (loop < jsonObject.list.length) {
    // stock은 더미 데이터로 냅두기
    recordInfo = await record.readRecord(
      jsonObject.docsCode,
      jsonObject.list[loop].prdCode
    )
    recordResult = await record.updateRecord(
      jsonObject.docsCode,
      jsonObject.list[loop].prdCode,
      jsonObject.list[loop].prdName,
      jsonObject.list[loop].quantity,
      recordInfo.stock +
        docsTypeSwitch * (jsonObject.list[loop].quantity - recordInfo.quantity)
    )
    // 위 데이터 이후 날짜의 record에 변화량 반영
    recordUpdateResult = await record.stockRecord(
      jsonObject.list[loop].prdCode,
      jsonObject.list[loop].quantity - recordInfo.quantity,
      docsInfo.docsType,
      docsInfo.date,
      docsInfo.checkedTime
    )
    // 수정 quantity - 기존 quantity 에 docsType으로 +- 판별..
    prdResult = await product.stockProduct(
      jsonObject.list[loop].prdCode,
      jsonObject.list[loop].quantity - recordInfo.quantity,
      jsonObject.docsType
    )
    if (
      recordResult == Error ||
      prdResult == Error ||
      recordUpdateResult == Error
    ) {
      await connection.staticQuery('rollback')
      break
    }
    loop++
  }
  if (
    recordResult == Error ||
    prdResult == Error ||
    recordUpdateResult == Error ||
    docsResult == Error
  ) {
    await connection.staticQuery('rollback')
    console.log('ERROR')
    res.json('ERROR')
  } else {
    await connection.staticQuery('commit')
    console.log('SUCCESS')
    res.json('SUCCESS')
  }
})

app.post('/docs/check', async (req, res) => {
  let docsCode = req.body.docsCode
  let checker = req.body.checker
  let state = await document.checkDocumentState(docsCode)
  if (state == 'check') {
    res.json('already checked')
  } else if (state == 'confirm') {
    res.json('already confirm')
  } else {
    let result = await document.checkDocument(docsCode, checker)
    console.log(result)
    res.json(result)
  }
})

app.post('/docs/confirm', async (req, res) => {
  let docsCode = req.body.docsCode
  let state = await document.checkDocumentState(docsCode)
  if (state == 'check') {
    let result = await document.confirmDocument(docsCode)
    console.log(result)
    res.json(result)
  } else if (state == 'confirm') {
    res.json('already confirm')
  } else {
    res.json('need check')
  }
})

app.post('/docs/list', async (req, res) => {
  let year = req.body.year
  let month = req.body.month
  let result = await document.readDocument(year, month)
  console.log(result)
  res.json(result)
})

app.post('/docs/info', async (req, res) => {
  let docsCode = req.body.docsCode
  let result = await document.readDocumentInfo(docsCode)
  console.log(result)
  res.json(result)
})

app.post('/docs/delete', async (req, res) => {
  // docsCode만 입력 받는다고 가정
  let docsCode = req.body.docsCode
  connection.staticQuery(`start transaction`)
  // 해당 docs의 정보 가져오기
  let docsInfo = await document.readDocumentInfo(docsCode)
  console.log(docsInfo.docsType)
  if (docsInfo.docsType == 'input') {
    docsInfo.docsType = 'output'
  } else {
    docsInfo.docsType = 'input'
  }
  // 해당 문서의 레코드 리스트를 전부 가져오기
  let recordList = await record.readDocumentRecord(docsCode)
  let loop = 0
  let recordResult
  let prdResult
  let recordUpdateResult
  while (loop < recordList.length) {
    // 레코드 삭제 시 prd 스톡 반영하기
    prdResult = await product.stockProduct(
      recordList[loop].prdCode,
      recordList[loop].quantity,
      docsInfo.docsType
    )
    // 레코드 삭제 시 record 반영
    recordUpdateResult = await record.stockRecord(
      recordList[loop].prdCode,
      recordList[loop].quantity,
      docsInfo.docsType,
      docsInfo.date,
      docsInfo.checkedTime
    )
    // 레코드 삭제
    recordResult = await record.deleteRecord(docsCode, recordList[loop].prdCode)
    if (
      recordResult == Error ||
      prdResult == Error ||
      recordUpdateResult == Error
    ) {
      await connection.staticQuery('rollback')
      break
    }
    loop++
  }
  let docsResult = await document.deleteDocument(docsCode)
  if (
    recordResult == Error ||
    prdResult == Error ||
    recordUpdateResult == Error ||
    docsResult == Error
  ) {
    await connection.staticQuery('rollback')
    console.log('ERROR')
    res.json('ERROR')
  } else {
    await connection.staticQuery('commit')
    console.log('SUCCESS')
    res.json('SUCCESS')
  }
})

//
// RECORD
//

//
// RECORD의 CREATE, UPDATE, DELETE 동작은 DCOUMENT에 종속
// READ 동작은 DOCUMENT 및 PRODUCT에 종속됨
//

app.post('/record/update', async (req, res) => {
  let prdCode = req.body.prdCode
  let docsCode = req.body.docsCode
  let prdName = req.body.prdName
  let quantity = req.body.quantity
  let stock = req.body.stock
  let result = await record.updateRecord(prdCode, docsCode, prdName, quantity)
  console.log(result)
  res.json(result)
})

app.post('/docs/record', async (req, res) => {
  let docsCode = req.body.docsCode
  let result = await record.readDocumentRecord(docsCode)
  console.log(result)
  res.json(result)
})

app.post('/prd/record', async (req, res) => {
  let prdCode = req.body.prdCode
  let result = await record.readProductRecord(prdCode)
  console.log(result)
  res.json(result)
})

app.post('/record/delete', async (req, res) => {
  let docsCode = req.body.docsCode
  let prdCode = req.body.prdCode
  let result = await record.deleteRecord(docsCode, prdCode)
  console.log(result)
  res.json(result)
})

//
// app start
//

app.listen(PORT, () => {
  console.log(`Express server is listening at port : ${PORT}`)
})
