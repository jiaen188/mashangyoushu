<template>
  <div class="page-container">
    <div class="info-item">
      <div class="title">书名：</div>
      <div class="detail">{{info.title}}</div>
    </div>
    <div class="info-item">
      <div class="title">出版社：</div>
      <div class="detail">{{info.publisher}}</div>
    </div>
    <div class="info-item">
      <div class="title">作者：</div>
      <div class="detail">{{info.author}}</div>
    </div>
    <div class="info-item">
      <div class="title">ISBN：</div>
      <div class="detail">{{info.isbn13}}</div>
    </div>
    <div class="info-item">
      <div class="title">定价：</div>
      <div class="detail">{{info.price}}元</div>
    </div>
    <div class="comment">备注：</div>
    <div class="text-container">
      <textarea id="" v-model="remark" cols="30" rows="10"></textarea>
    </div>
    <div class="btn-container">
      <button class="btn btn-green" type="defalut" @click="confirm">确定</button>
      <button class="btn btn-clear" type="defalut" @click="cancle">取消</button>
    </div>
  </div>
</template>

<script>
import { post, get } from '../../util'

export default {
  data() {
    return {
      status: '',
      bookid: '',
      info: {},
      remark: ''
    }
  },
  mounted() {
    console.log('buy mounted')
    this.bookid = this.$root.$mp.query.id
    this.status = this.$root.$mp.query.status
    this.getDetail()
  },
  methods: {
    cancle() {
      wx.navigateBack({
        delta: 1
      })
    },
    confirm() {
      post(`apply/${this.bookid}`)
      .then(res => {
        console.log('apply confirm',res)
        // 添加图书后 的返回
        wx.switchTab({
          url: '../../pages/comments/main'
        })
      })
    },
    getDetail() {
      let param = ''
      if (this.status === undefined) {
        // 不在我们的书库
        param = `${this.bookid}`
      } else {
        param = `${this.bookid}?status=${this.status}`
      }
      get(`books/${param}`)
      .then(res => {
        console.log('books',res)
        this.info = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  .title {
    width: 80px;
    text-align: right;
    margin-right: 20rpx;
  }
  .detail {
    flex: 1;
  }
}
.text-container {
  textarea {
    border: 1px solid #ccc;
  }
}
.comment {
  width: 80px;
  text-align: right;
}
.text-container {
  margin-left: 20px;
  margin-right: 20px;
  textarea {
    width: 100%;
  }
}
.btn-container {
  width: 95%;
  position: fixed;
  bottom: 40rpx;
  display: flex;
  justify-content: space-around;
  .btn {
    width: 300rpx;
    margin: 0;
  }
  .btn-clear {
    margin-left: -20rpx;
    background: white;
    color: green;
    border: 1px solid green;
  }
}
</style>
