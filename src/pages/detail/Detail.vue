<template>
<div class="page-container">
  <scroll-view scroll-y style="height: calc(100vh - 60px)">

    <div class="book-container">
      <img class="img" :src="info.image">
      <div class="borrow-container">
        <div class="title">{{info.title}}</div>
        <div class="status">当前状态：{{info.statusText}}</div>
        <div v-if="info.borrowerName" class="borrower">当前借阅者：{{info.borrowerName}}</div>
        <div v-if="info.borrowerName" class="cycle">借阅周期：{{info.borrowCycle}}</div>
        <div class="container">
          <div class="collection">
            <span>☆</span>
            收藏
          </div>
          <div class="show-hisotry" @click="showHistory(info)">
            查看借阅历史
          </div>
        </div>
      </div>
    </div>

    <div class="publish-container">
      <div class="title">出版信息</div>
      <div class="info">
        <span class="item">作者：{{info.author}}</span>
        <span class="item">页数：{{info.pages}}</span>
        <span class="item">出版社：{{info.publisher}}</span>
        <span class="item">豆瓣评分：{{info.average}}</span>
        <span class="item">出版年：{{info.pubdate|| '未查到出版社'}}</span>
        <span class="item">ISBN: {{info.isbn13}}</span>
      </div>
    </div>

    <div class="introduce-container">
      <div class="title">书籍简介</div>
      <div class="info">
        <p>{{info.summary}}</p>
      </div>
    </div>

    <!-- <div class="qrcode-container">
      <canvas class='canvas' canvas-id='canvas' bindlongtap='save'></canvas>
    </div> -->
  </scroll-view>
  <button v-if="info.status === 101 || info.status === 102" class="btn btn-disable">正在采购中，请耐心等待</button>
  <button v-if="info.status === 100" class="btn btn-blue" @click="goBuy(info)">申请购买</button>
  <button v-if="info.status === 202 || info.status === 201" class="btn btn-green" @click="contactOwner(info)">联系拥有者</button>
</div>
</template>

<script>
import { get, post, showModal } from '../../util.js'
import BookInfo from '../../components/BookInfo'
import CommentList from '../../components/CommentList'
const QRCode = require('../../weapp-qrcode.js')

const statusList = {
  100: '未入库',
  101: '待采购',
  102: '采购中',
  201: '在库',
  202: '借出',
  301: '损毁',
  302: '遗失'
}

export default {
  data () {
    return {
      userinfo: {},
      comments: [],
      bookid: '',
      info: {},
      comment: '',
      location: '',
      phone: '',
      token: '',
      status: ''
    }
  },
  computed: {

  },
  created () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  mounted () {
    // 1. 如何获取小程序在 page onLoad 时候传递的 options http://mpvue.com/mpvue/#_18
    this.bookid = this.$root.$mp.query.id
    this.status = this.$root.$mp.query.status
    this.getDetail()
  },
  methods: {
    contactOwner(item) {
      console.log('联系拥有者', item)
    },
    goBuy(item) {
      let url = ''
      if (item.status !== undefined) {
        // 已经在我们的书库
        url = `/pages/buy/main?id=${item.id}&status=${item.status}`
      } else {
        url = '/pages/buy/main?id=' + item.isbn13
      }
      wx.navigateTo({
        url
      })
    },
    showHistory(item) {
      wx.navigateTo({
        url: `/pages/history/main?id=${item.id}`
      })
    },
    createQrcode(bookid) {
      console.log('创建 qrcode', bookid)

      var qrcode = new QRCode('canvas', {
          // usingIn: this,
          text: bookid,
          width: 150,
          height: 150,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
      })
    },
    getDetail () {
      this.token = wx.getStorageSync('token')
      if (this.token) {
        let _this = this
        let param = ''
        if (this.status === undefined) {
          // 不在我们的书库
          param = `${this.bookid}`
        } else {
          param = `${this.bookid}?status=${this.status}`
        }
        wx.request({
          url: `http://hm2.hwd.cn/api/v1/books/${param}`,
          header: {
            'authorization': `bearer ${this.token}`
          },
          success(res) {
            console.log('books',res)
            // 添加图书后 的返回
            if (res.data.code === 0 ) {
              let result = {...res.data.data, statusText: statusList[res.data.data.status]}
              _this.info = result
            }
          }
        })
      }
    }
  },
  components: {
    BookInfo,
    CommentList
  }
}
</script>

<style lang="scss" scoped>
.comment {
  margin-top: 10px;
  .textarea {
    width: 730rpx;
    height: 200rpx;
    background: #eee;
    padding: 10px;
  }
  .location {
    margin-top: 10px;
    padding: 5px 10px;
  }
  .phone {
    margin-top: 10px;
    padding: 5px 10px;
  }
}
.qrcode-container {
  display: flex;
  justify-content: center;
  .canvas {
    width: 150px;
  }
}
.book-container {
  display: flex;
  .img {
    width: 200rpx;
    height: 250rpx;
  }
  .borrow-container {
    flex: 1;
    margin-left: 20rpx;
    font-size: 32rpx;
    .title {
      font-size: 40rpx;
      margin-bottom:20rpx;
    }
    .container {
      display: flex;
      justify-content: space-between;
    }
  }
}
.publish-container {
  margin-top: 20rpx;
  .info {
    padding-left: 10rpx;
    padding-right: 10rpx;
    .item {
      display: inline-block;
      font-size: 32rpx;
      width: 50%;
    }
  }
}
.introduce-container {
  margin-top: 20rpx;
  .info {
    padding-left: 10rpx;
    padding-right: 10rpx;
    p {
      text-indent: 2em;
      font-size: 32rpx;
    }
  }
}
.btn {
  margin-bottom: 0;
  margin-top: 20rpx;
}
</style>
