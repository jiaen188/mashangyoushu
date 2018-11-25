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
import { get } from '../../util'

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
      get(`borrow/${this.bookid}`)
      .then(res => {
        console.log('history*******',res)
        this.list = res.data.map(item => {
          return {
            ...item,
            created_at: item.created_at && item.created_at.split(' ')[0],
            return_at: item.return_at && item.return_at.split(' ')[0]
          }
        })
        this.loading = res.data.length === 0
      })
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
