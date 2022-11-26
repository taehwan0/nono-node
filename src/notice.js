const db = require('./db.js')
const moment = db.moment
const connection = db.connection

/*
공지사항 생성 
공지사항 수정
공시사항 삭제
공지사항 최근 3개 읽기
공지사항 최근 중요 읽기
공지사항 리스트 전부 읽기
공지사항 내용이 포함된 리스트 전부 읽기
공지사항 특정 코드에 해당하는 내용 읽기
*/

// 공지사항 생성 // 코드 및 등록시간 자동 생성
const createNotice = (title, post, writer, focus = false) => {
  return new Promise((resolve, reject) => {
    // 공지사항 코드 생성 로직 필요
    // 공지사항 코드는 sql server에서 자동 생성 1~
    let registerDate = moment().format('YYYYMMDDHHmmss')
    connection.query(
      `insert into Notice (title, post, writer, registerDate, focus)
            values ('${title}', '${post}', '${writer}', '${registerDate}', ${focus})`,
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

// 코드에 해당하는 공지사항 업데이트
// noticeCode / writer에 해당하는 공지사항의 title, post, focus 업데이트
const updateNotice = (noticeCode, writer, title, post, focus = false) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update Notice set title='${title}', post='${post}', focus=${focus} where noticeCode='${noticeCode}' and writer = '${writer}'`,
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

// 최근 Notice 20개 불러오기
const readNoticeInfoAll = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select noticeCode, title, post, writer, registerDate, focus from Notice order by registerDate desc LIMIT 20`,
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
// 특정 공지사항 내용 불러오기
const readNoticeInfo = (noticeCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select noticeCode, title, post, writer, registerDate, focus from Notice where noticeCode='${noticeCode}'`,
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

// 최근 등록된 3개의 공지사항 가져오기
const readNoticeRecent = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select noticeCode, title, post, writer, registerDate, focus from Notice order by registerDate desc LIMIT 3`,
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

// 최근 등록된 1개의 중요 공지사항 가져오기
const readNoticeFocus = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select noticeCode, title, post, writer, registerDate, focus from Notice where focus = True order by registerDate desc LIMIT 1`,
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

// 특정 코드에 해당하는 공지사항 삭제하기
const deleteNotice = (noticeCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `delete from Notice where noticeCode = ${noticeCode}`,
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
  createNotice, // 공지사항 생성
  updateNotice, // 공지사항 업데이트
  readNoticeInfoAll, // 공지사항 리스트 (내용포함) 읽기
  readNoticeInfo, // 특정 공지사항 읽기
  readNoticeRecent,
  readNoticeFocus,
  deleteNotice,
}
