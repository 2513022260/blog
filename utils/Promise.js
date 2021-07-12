// 1-1 Promise存在三个状态（state）pending、fulfilled、rejected
const state = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

class Promise1 {
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
    executor(resolve, reject)
  }

  // 2-1 then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled, onRejected) {
    // 2-2 状态为fulfilled，执行onFulfilled，传入成功的值
    if (this.state === state.FULFILLED) {
      onFulfilled(this.value)
    }
    // 2-4 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === state.REJECTED) {
      onRejected(this.reason)
    }
    // 3-1 状态为pending时
    if (this.state === state.PENDING) {
      // onFulfilled传入到成功数组
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value)
      })
      // onRejected传入到失败数组
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

// 1. 立即执行 executor(resolve, reject)
let p = new Promise1((resolve, reject) => {})
p.then((e) => {
  console.log(1, e)
})
p.then((e) => {
  console.log(2, e)
})