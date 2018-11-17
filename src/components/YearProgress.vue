<template>
  <div class="progress-bar">
    <progress :percent="percent" activeColor="#EA5A49"></progress>
    <p>{{year}}已经过去了{{days}}天，{{percent}}%, 已经阅读{{books}}本书</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: 0
    }
  },
  mounted() {
    this.getMyBook()
  },
  onShow() {
    this.getMyBook()
  },
  methods: {
    isLeapYeader () {
      const year = new Date().getFullYear()
      if (year % 400 === 0) {
        return true
      } else if (year % 4 === 0 && year % 100 !== 0) {
        return true
      } else {
        return false
      }
    },
    getDayOfYear () {
      return this.isLeapYeader() ? 366 : 365
    },
    getMyBook() {
      this.token = wx.getStorageSync('token')
      let _this = this
      if (this.token) {
        wx.request({
          url: `http://hm2.hwd.cn/api/v1/my/book`,
          header: {
            'authorization': `bearer ${this.token}`
          },
          success(res) {
            console.log('mybook',res)
            if (res.data.code === 0 && res.data.data.length !==0) {
              _this.books = res.data.data.length
            }
          }
        })
      }
    }
  },
  computed: {
    year () {
      return new Date().getFullYear()
    },
    days () {
      let start = new Date()
      // start就是今年第一天
      start.setMonth(0)
      start.setDate(1)

      // 今天的时间戳 减去今年第一天的时间戳
      let offset = new Date().getTime() - start.getTime()
      return parseInt(offset / 1000 / 60 / 60 / 24) + 1
    },
    percent () {
      return (this.days * 100 / this.getDayOfYear()).toFixed(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 40px;
  width: 100%;
  progress {
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
  }
}
</style>
