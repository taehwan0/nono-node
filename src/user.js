const db = require('./db.js')
const connection = db.connection

/*
유저 생성
유저 수정
유저 전체 조회
유저 1명 조회
유저 활성화 여부 조회
유저 활성 비활성 토글
유저 로그인 (true 반환?) 지금은 문자열 반환 하도록 되어있음
유저 로그아웃 (웹 필요시 제작)
유저 삭제
*/

// 유저 생성
const createUser = (userName, userPW, grade) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into User (userName, userPW, grade) values ('${userName}', '${userPW}', '${grade}')`,
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

// 유저 수정
const updateUser = (userCode, userName, userPW, grade, activation) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update User set userName = '${userName}', userPW = '${userPW}', grade = '${grade}', activation = '${activation}' where userCode = ${userCode}`,
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
// 유저 상태 확인 (내부용)
const checkActivationUser = (userCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from User where userCode = ${userCode}`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result == 0) {
          console.log('Error : No match User')
          reject(new Error('No match User'))
        }
        resolve(result[0].activation)
      }
    )
  })
}

// 유저 activation 토글
const setUserState = (userCode, state) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `update User set activation = ${state} where userCode = ${userCode}`,
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

// 모든 유저 정보 불러오기
const readUser = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select userCode, userName, userPW, grade, activation from User `,
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

// 활성화 되어 있는 유저 불러오기
const readUserActive = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select userCode, userName, userPW, grade, activation from User where activation = 1`,
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

// 유저 1명 조회
const readUserInfo = (userCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select userCode, userName, userPW, grade, activation from User where userCode = '${userCode}'`,
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

// 유저 로그인 = id pw 검사
const loginUser = (userName, userPW) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from User where userName = '${userName}' and userPW = '${userPW}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result == 0) {
          // 비밀번호가 다르거나 사용자가 존재하지 않음
          resolve(0)
        } else if (result[0].activation == 0) {
          resolve('-1')
        }
        const jsonObject = new Object()
        jsonObject.message = '1'
        jsonObject.userCode = result[0].userCode
        jsonObject.grade = result[0].grade
        resolve(jsonObject)
      }
    )
  })
}

// 유저 정보 삭제
const deleteUser = (userCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `delete from User where userCode = ${userCode}`,
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

const verifyUser = (userCode, grade) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from User where userCode = '${userCode}' and grade = '${grade}'`,
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else if (result == 0) {
          // 매칭되는 유저가 없음
          resolve(false)
        } else {
          if (
            result[0].userCode == userCode &&
            result[0].grade == grade &&
            result[0].activation == 1
          ) {
            resolve(true)
          } else {
            // 매칭되는 유저가 없거나 위의 조건식 불충분
            resolve(false)
          }
        }
      }
    )
  })
}
module.exports = {
  createUser,
  updateUser,
  checkActivationUser,
  setUserState,
  //   activationUser,
  //   deactivationUser,
  readUser,
  readUserActive,
  readUserInfo,
  loginUser,
  deleteUser,
  verifyUser,
}
