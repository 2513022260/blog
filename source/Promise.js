const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class myPromise {
  constructor(fn) {
    this.status = PENDING
    this.value = null
    this.reason = null
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve(value) {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
    }
  }
  reject(reason) {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
    }
  }
}

const p = new myPromise((resolve, reject) => {
  resolve(2222222)
})
