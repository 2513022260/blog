const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class myPromise {
  constructor(fn) {
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onFulfilledCallbacks = []  // 保存成功回调
    this.onRejectedCallbacks = []  // 保存失败回调
    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error) 
    }
  }
  resolve(value) {
    if (this.status === PENDING) {
      setTimeout(() => {
        this.status = FULFILLED
        this.value = value
        this.onFulfilledCallbacks.forEach(callback => {
          callback(value)
        })
      })
    }
  }
  reject(reason) {
    if (this.status === PENDING) {
      setTimeout(() => {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(callback => {
          callback(reason)
        })
      })
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    // 新增Promise实例并返回
    const promise2 = new myPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject) 
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject) 
            } catch (error) {
              reject(error)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {}

console.log(1)
const p = new myPromise((resolve, reject) => {
  setTimeout(() => {
    console.log(2)
    resolve(3)
    console.log(4)
  })
})
p.then((value) => {
  console.log('value:' + value)
}, (reason) => {
  console.log(reason)
})
console.log(5)
