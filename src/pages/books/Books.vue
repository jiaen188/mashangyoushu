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
      tops: []
    }
  },
  onShow() {
    this.getBooklist()
  },
  methods: {
    goSearch() {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    getBooklist() {
      get('books')
      .then(res => {
        console.log('books', res)
        this.books = [...res.data]
        if (res.data.length >=9 ) {
          this.tops = res.data.splice(0, 9)
        }
      })
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
