<template>
  <div class="container">

    <i-tabs class="tab" :current="current" @change="handleChange">
      <i-tab key="tab1" title="我的图书"></i-tab>
      <i-tab key="tab2" title="我的采购申请"></i-tab>
      <i-tab v-if="isShowAll" key="tab3" title="所有采购列表"></i-tab>
    </i-tabs>

    <div v-show="current === 'tab1'">
      <div class="book-container" v-for="book in mybooks" :key="book.id" @click="goDetail(book)">
        <img :src="book.image" mode="aspectFit" class="image">
        <div class="info">
          <div class="header">
            <div class="title">{{book.title}}</div>
            <div class="status">{{book.statusText}}</div>
          </div>
          <div class="publish">
            {{book.author}} / {{book.publisher}} / {{book.average}}
          </div>
          <div class="time">
            <div class="time-detail">拥有日期{{book.updated_at}}</div>
            <div class="from canclick" @click.stop="showQrcode(book)">去转借</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isShowDesk" class="desk">
      <div class="title">我的转借码</div>
      <div class="qrcode-container">
        <canvas class='canvas' canvas-id='canvas' bindlongtap='save'></canvas>
      </div> 
      <div class="name">{{selected.title}}</div>
      <div class="line"></div>
      <div class="close" @click="closeDesk">关闭</div>
    </div>

    <div v-show="current === 'tab2'">
      <div class="book-container" v-for="book in myapplys" :key="book.id">
        <img :src="book.image" mode="aspectFit" class="image">
        <div class="info">
          <div class="header">
            <div class="title">{{book.title}}</div>
            <div class="status">{{book.statusText}}</div>
          </div>
          <div class="publish">
            {{book.author}} / {{book.publisher}} / {{book.average}}
          </div>
          <div class="time">申请日期{{book.apply_at}}</div>
        </div>
      </div>
    </div>

    <div v-show="current === 'tab3'">
      <div class="book-container" v-for="book in allapplys" :key="book.id">
        <img :src="book.image" mode="aspectFit" class="image">
        <div class="info">
          <div class="header">
            <div class="title">{{book.title}}</div>
            <div class="status canclick" @click.stop="changeStatus(book)">{{book.statusText}}</div>
          </div>
          <div class="publish">
            {{book.author}} / {{book.publisher}} / {{book.average}}
          </div>
          <div class="time">
            <div class="time">
              <div class="time-detail">日期{{book.apply_at}}</div>
              <div class="from">申请人：{{book.applyerName}}</div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { get, put, showSuccess } from '../../util.js'
import Card from '../../components/Card'
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
      books: [],
      current: 'tab1',
      isShowAll: false,
      mybooks: [],
      myapplys: [],
      allapplys: [],
      isShowDesk: false,
      selected: {},
      timer: null,
      qrcode: null
    }
  },
  mounted() {
    this.userinfo = wx.getStorageSync('userinfo')
    if (this.userinfo) {
      get('user', {
        username: this.userinfo.nickName
      })
      .then(res => {
        console.log('username', res)
        if (res.roles === 'ROLE_SUPER_ADMIN') {
          this.isShowAll = true
          this.getAllApply()
        }
      })
    }
  },
  onHide() {
    this.closeDesk()
  },
  onShow () {
    this.getMyBook()
    this.getMyApply()
    if (this.isShowAll) {
      this.getAllApply()
    }
  },
  methods: {
    changeStatus(item) {
      console.log('status', item.status)
      if (item.status !== 101) {
        return
      }
      put(`purchase/${item.id}`)
      .then(res => {
        console.log('purchase****',res)
        this.getAllApply()
      })
    },
    closeDesk() {
      this.isShowDesk = false
      this.selected = {}
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    showQrcode(item) {
      this.selected = item
      this.isShowDesk = true
      if (this.qrcode) {
        console.log('has qrcode')
        this.qrcode.makeCode(`borrowid ${item.id}`)
      } else {
        this.qrcode = new QRCode('canvas', {
          // usingIn: this,
          text: `borrowid ${item.id}`,
          width: 150,
          height: 150,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        })
      }
      
      this.timer = setInterval(this.getBorrowSucc, 1000)
    },
    getBorrowSucc() {
      get(`back/${this.selected.id}`)
      .then(res => {
        console.log('back', res)
        if (_this.timer) {
          clearInterval(_this.timer)
        }
        showSuccess('已转借成功')
        this.closeDesk()
        this.getMyBook()
      })
    },
    goDetail(item) {
      let url = ''
      if (item.status !== '') {
        // 已经在我们的书库
        url = `/pages/detail/main?id=${item.id}&status=${item.status}`
      } else {
        url = '/pages/detail/main?id=' + item.isbn13
      }
      wx.navigateTo({
        url
      })
    },
    handleChange(e) {
      console.log(e)
      this.current = e.mp.detail.key
      if (this.isShowAll && this.current === 'tab3') {
        this.getAllApply()
      }
      if (this.current === 'tab1') {
        this.getMyBook()
      }
      if (this.current === 'tab2') {
        this.getMyApply()
      }
    },
    getMyBook() {
      get('my/book')
      .then(res => {
        console.log('mybook', res)
        if (res.length) {
          this.mybooks = res.map(item => {
            return this.dealResult(item)
          })
        }
      })
    },
    getMyApply() {
      get('my/apply')
      .then(res => {
        console.log('myapply',res)
        if (res.length) {
          this.myapplys = res.map(item => {
            return this.dealResult(item)
          })
        }
      })
    },
    getAllApply() {  
      get('allapply')
      .then(res => {
        console.log('allapply', res)
        if (res.length) {
          this.allapplys = res.map(item => {
            return this.dealResult(item)
          })
        }
      })
    },
    dealResult(item) {
      return {
        ...item, 
        statusText: item.status && statusList[item.status],
        apply_at: item.apply_at && item.apply_at.split(' ')[0],
        created_at: item.created_at && item.created_at.split(' ')[0],
        updated_at: item.updated_at && item.updated_at.split(' ')[0]
      }
    }
  },
  components: {
    CommentList,
    Card
  }
}
</script>

<style lang="scss" scoped>
.book-container {
  display: flex;
  margin-top: 40rpx;
  margin-bottom: 40rpx;
  .image {
    width: 70px;
    height: 70px;
  }
  .info {
    flex: 1;
    padding-right: 20rpx;
    font-size: 18px;
    .header {
      display: flex;
      justify-content: space-between;
    }
    .publish {
      font-size: 16px;
      line-height: 20px;
      color: #333;
    }
    .time {
      display: flex;
      justify-content: space-between;
    }
  }
}
.desk {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  .qrcode-container {
    background: #fff;
    display: flex;
    justify-content: center;
    margin-top: 50rpx;
    margin-bottom: 50rpx;
    .canvas {
      width: 150px;
    }
  }
  .line {
    height: 5px;
    width: 80%;
    background: #666;
  }
  .close {
    margin-top: 50rpx;
    color: green;
  }
}
</style>

