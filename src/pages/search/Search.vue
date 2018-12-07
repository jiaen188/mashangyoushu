<template>
  <div class="page-container">
    <div class="search">
      <input confirm-type="search" auto-focus="true" placeholder="请输入书名" v-model="key" @confirm="searchlist($event)" />
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
import { get } from '../../util';

export default {
  data() {
    return {
      key: '',  
      books: [],
      loading: false
    }
  },
  methods: {
    searchlist() {
      console.log(this.key)
      get('search', {
        kw: this.key
      })
      .then(res => {
        let external = []
        if (Array.isArray(res.external.data)) {
          external = res.external.data
        } else {
          external = Object.values(res.external.data)
        }
        this.books = [...res.storage.data, ...external]
        this.loading = res.data.length === 0
      })
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
