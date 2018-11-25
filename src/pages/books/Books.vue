<template>
  <div class="page-container">
    <div class="search" @click="goSearch">
      <input confirm-type="search" placeholder="搜索" />
      <!-- <button type="defalut" class="btn">搜索</button> -->
    </div>
    <top-swiper v-if="tops.length" :tops="tops"></top-swiper>

    <card v-for="book in books" :key="book.id" :book="book"></card>

  </div>
</template>

<script>
import { get } from '../../util.js'
import Card from '../../components/Card'
import TopSwiper from '../../components/TopSwiper'

export default {
  data () {
    return {
      books: [],
      page: 0,
      more: true,
      tops: [],
      token: ''
    }
  },
  mounted () {
    // this.getList(true)
    // this.getTop()
    // this.getBooklist()
  },
  onShow() {
    console.log('hosw****')
    this.getBooklist()
  },
  methods: {
    goSearch() {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    getBooklist() {
      this.token = wx.getStorageSync('token')
      let _this = this
      if (this.token) {
        // 去请求列表 todo
        wx.request({
          url: `https://book.fatewolf.com/api/v1/books`,
          header: {
            'authorization': `bearer ${this.token}`
          },
          success(res) {
            console.log('bookslist',res)
            // 添加图书后 的返回
            if (res.data.code === 0 ) {
              _this.books = [...res.data.data.data]
              if (res.data.data.data.length >=9 ) {
                _this.tops = res.data.data.data.splice(0, 9)
                console.log('tops****', _this.tops)
              }
              // _this.tops = res.data.data.data
              console.log('booke', _this.books, _this)
            }
          }
        })
      }
    }
  },
  components: {
    Card,
    TopSwiper
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
