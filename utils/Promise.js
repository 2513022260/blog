// 1-1 Promise存在三个状态（state）pending、fulfilled、rejected
const state = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

class Promise {
  // 0-1 构造器
  constructor(executor) {
    // 1-2 默认为pending状态
    this.state = state.PENDING
    // 1-3 成功的值
    this.value = undefined
    // 1-4 失败原因
    this.reason = undefined
    // 3-1 成功存放的数组
    this.onFulfilledCallbacks = []
    // 3-2 失败存放法数组
    this.onRejectedCallbacks = []
    // 0-2 成功
    let resolve = (value) => {
      // 1-3 只能从pending =》 fulfilled resolve调用后，state转化为成功态 存储成功的值
      if (this.state === state.PENDING) {
        this.state = state.FULFILLED
        this.value = value
        // 一旦resolve执行，调用成功数组的函数
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }
    // 0-3 失败
    let reject = (reason) => {
      // 1-4 只能从pending =》 rejected reject调用后，state转化为失败态 存储失败的原因
      if (this.state === state.PENDING) {
        this.state = state.REJECTED
        this.reason = reason
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    // 0-4 立即执行
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  // 2-1 then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled, onRejected) {
    // 6-1 onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    // 6-2  onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected  = typeof onRejected  === 'function' ? onRejected : err => { throw err };

    // 4-1 声明返回的promise2
    let promise2 = new Promise((resolve, reject) => {
      // 2-2 状态为fulfilled，执行onFulfilled，传入成功的值
      if (this.state === state.FULFILLED) {
        // 6-3 异步处理
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            // 4-1 resolvePromise函数，处理自己return的promise和默认的promise2的关系
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)  
          }
        }, 0)
      }
      // 2-4 状态为rejected，执行onRejected，传入失败的原因
      if (this.state === state.REJECTED) {
        // 6-3 异步处理
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            // 4-1
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)  
          }
        }, 0)
      }
      // 3-1 状态为pending时
      if (this.state === state.PENDING) {
        // onFulfilled传入到成功数组
        this.onFulfilledCallbacks.push(() => {
          // 6-3 异步处理
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              // 4-1 resolvePromise函数，处理自己return的promise和默认的promise2的关系
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)  
            }
          }, 0)
        })
        // onRejected传入到失败数组
        this.onRejectedCallbacks.push(() => {
          // 6-3 异步处理
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            // 4-1
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)  
          }
        }, 0)
        })
      }
    })
    return promise2
  }

  catch(fn) {
    return this.then(null, fn)
  }
}

// 5-1 resolvePromise方法
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  // 防止多次调用
  let called
  // x不是null 且x是对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') { 
        then.call(x, y => {
          // 成功和失败只能调用一个
          if (called) return
          called = true
          // resolve的结果依旧是promise 那就继续解析
          resolvePromise(promise2, y, resolve, reject)
        }, err => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          reject(err) // 失败了就失败了
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      // 也属于失败
      if (called) return
      called = true
      // 取then出错了那就不要在继续执行了
      reject(e)
    }
  } else {
    resolve(x)
  }
}

// 7 测试
Promise.defer = Promise.deferred = function(){
  let dfd = {}
  dfd.promise = new Promise((resolve, reject)=>{
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
module.exports =  Promise

// 扩展
// catch、resolve、reject、race、all
// resolve
Promise.resolve = function(val) {
  return new Promise((resolve, reject) => resolve(val))
}
// reject
Promise.reject = function(val) {
  return new Promise((resolve, reject) => reject(val))
}
// race
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}
// all 获取所有的promise，都执行then，把结果放到数组，一起返回
Promise.all = function(promises) {
  let arr = []
  let i = 0
  function processData(index, data) {
    arr[index] = data
    i++
    if (i === promises.length) resolve(arr)
  }

  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(data => {
        processData(i, data)
      }, reject)
    } 
  })
}
