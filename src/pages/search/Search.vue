<template>
  <div class="page-container">
    <div class="search">
      <input confirm-type="search" placeholder="请输入书名" v-model="key" @confirm="searchlist($event)" />
      <button type="defalut" class="btn" @click="searchlist">搜索</button>
    </div>

    <card v-for="book in books" :key="book.id" :book="book"></card>

    <p class="text-footer" v-if="loading && books.length === 0">
      没有更多数据
    </p>

  </div>
</template>

<script>
import Card from '../../components/Card'

export default {
  data() {
    return {
      token: '',
      key: '',  
      books: [],
      loading: false
    }
  },
  mounted() {

  },
  methods: {
    searchlist() {
      console.log(this.key)
      if (this.key) {
        this.token = wx.getStorageSync('token')
        let _this = this
        wx.request({
          url: `http://hm2.hwd.cn/api/v1/search?kw=${this.key}`,
          header: {
            'authorization': `bearer ${this.token}`
          },
          success(res) {
            console.log('search',res)
            if (res.data.code === 0 ) {
              _this.books = res.data.data.data
              console.log(_this.books)
              _this.loading = res.data.data.data.length === 0
            }
          }
        })
      }
    }
  },
  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  input {
    height: 80rpx;
    border: 1px solid #333;
    border-radius: 5px;
    padding-left: 20rpx;
    flex: 1;
    margin-right: 10px;
  }
  .btn {
    width: auto;
    margin: 0;
  }
}
</style>
