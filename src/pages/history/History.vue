<template>
  <div class="page-container">
    <div class="head-container">
      <div class="item">借阅者</div>
      <div class="item">借入时间</div>
      <div class="item">借出时间</div>
    </div>

    <div class="list-container" v-for="item in list" :key="item.id">
      <div class="item">{{item.name}}</div>
      <div class="item">{{item.created_at}}</div>
      <div class="item">{{item.return_at || '暂无'}}</div>
    </div>
    <p class="text-footer" v-if="loading && list.length === 0">
      暂无借阅历史
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userinfo: {},
      bookid: '',
      list: [],
      loading: false
    }
  },
  mounted() {
    console.log('history')
    this.bookid = this.$root.$mp.query.id
    this.getHistory()
  },
  methods: {
    getHistory() {
      this.token = wx.getStorageSync('token')
      let _this = this
      if (this.token) {
        wx.request({
          url: `http://hm2.hwd.cn/api/v1/borrow/${this.bookid}`,
          header: {
            'authorization': `bearer ${this.token}`
          },
          success(res) {
            console.log('borrow',res)
            if (res.data.code === 0) {
              _this.list = res.data.data.data.map(item => {
                return {
                  ...item,
                  created_at: item.created_at.split(' ')[0],
                  return_at: item.return_at.split(' ')[0]
                }
              })
              _this.loading = res.data.data.data.length === 0
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.head-container {
  display: flex;
  justify-content: space-between;
  .item {
    width: 33.33%;
    text-align: center;
  }
}
.list-container {
  display: flex;
  justify-content: space-between;
  font-size: 32rpx;
  .item {
    width: 33.33%;
    text-align: center;
  }
}
</style>
