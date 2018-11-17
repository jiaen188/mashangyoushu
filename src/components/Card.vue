<template>
  <a :href="detailUrl">
    <div class="book-card">
      <div class="thumb" @click.stop="preview">
        <img :src="book.image" mode="aspectFit" class="image">
      </div>
      <div class="detail">
        <div class="row text-primary">
          <!-- <div class="right">
            {{book.rate}} <rate :value="book.rate"></rate>
          </div> -->
          <div class="left">
            {{book.title}}
          </div>
        </div>
        <div class="row">
          <!-- <div class="right text-primary">
            浏览量：{{book.count}}
          </div> -->
          <div class="left">
            豆瓣评分：{{book.average}}
          </div>
        </div>
        <div class="row">
          <!-- <div class="right">
            {{book.user_info && book.user_info.nickName}}
          </div> -->
          <div class="left">
            {{book.author + ' / ' }}{{book.publisher + ' / '}}{{book.pubdate}}
          </div>
        </div>
      </div>
    </div>
  </a>

</template>

<script>
import Rate from './Rate.vue'

export default {
  props: ['book'],
  methods: {
    preview () {
      wx.previewImage({
        current: this.book.image,
        urls: [this.book.image]
      })
    }
  },
  computed: {
    detailUrl () {
      if (this.book.status !== undefined) {
        // 已经在我们的书库
        return `/pages/detail/main?id=${this.book.id}&status=${this.book.status}`
      } else {
        return '/pages/detail/main?id=' + this.book.isbn13
      }
    }
  },
  components: {
    Rate
  }
}
</script>

<style lang="scss" scoped>
.book-card {
  padding: 5px;
  overflow: hidden;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 14px;
  .thumb {
    width: 90px;
    height: 90px;
    float: left;
    margin: 0 auto;
    overflow: hidden;
    .image {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .detail {
    margin-left: 100px;
    .row {
      line-height: 20px;
      margin-bottom: 3px;
      .right {
        float: right;
      }
      .left {
        margin-right: 80px;
      }
    }
  }
}
</style>
