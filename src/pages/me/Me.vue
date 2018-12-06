<template>
  <div class="container">
    <div class="switch-container">
      <i-switch :value="switchItem" @change="onChangeSwitch" slot="footer"></i-switch>
    </div>
    <div class="userinfo" @click="login">
      <img :src="userinfo.avatarUrl">
      <p>{{userinfo.nickName}}</p>
    </div>
    <YearProgress></YearProgress>

    <div v-if="userinfo.nickName" @click="scanBook" class="icon-container">
      <i-icon type="scan" size="100"></i-icon>
    </div>

    <button v-else type="defalut" open-type="getUserInfo" class='btn' @getuserinfo="onGetUserInfo">授权登陆</button>
    <div v-if="userinfo.nickName" class="tip">点我扫一扫</div>
    <button v-if="switchItem" class="btn" @click="clearHistory">清空缓存</button>
  </div>
</template>

<script>
import YearProgress from '../../components/YearProgress.vue'
import { showSuccess, showModal, post, get } from '../../util'
import qcloud from 'wafer2-client-sdk'
import config from '../../config.js'

export default {
  data () {
    return {
      switchItem: false,
      userinfo: {
        avatarUrl: '../../static/img/unlogin.png',
        nickName: ''
      }
    }
  },
  methods: {
    onChangeSwitch() {
      this.switchItem = !this.switchItem
    },
    clearHistory() {
      wx.clearStorage()
      this.userinfo = {
        avatarUrl: '../../static/img/unlogin.png',
        nickName: ''
      }
    },
    onGetUserInfo(e) {
      console.log(e)
      let _this = this
      if (e.target.userInfo) {
        this.userinfo.nickName = e.mp.detail.userInfo.nickName
        this.userinfo.avatarUrl = e.mp.detail.userInfo.avatarUrl

        wx.setStorageSync('userinfo', this.userinfo)
        console.log('nickname', this.userinfo.nickName)
        get(`auth`, {
          username: this.userinfo.nickName
        })
        .then(res => {
          console.log('auth get succsss', res)
          wx.setStorageSync('token', res.token)
        })
      }
    },
    borrowBook(id) {
      let _this = this
      console.log('borrow *********', Number(id))
      post(`borrow/${Number(id)}`, {}, false)
      .then(res => {
        showSuccess('借书成功')
        wx.switchTab({
          url: '../../pages/comments/main'
        })
      })
    },
    scanBook () {
      let _this = this
      wx.scanCode({
        success: (res) => {
          // 扫描结果是 书本的二维码
          if (res.result.indexOf('borrowid') > -1) {
            let codeString = res.result
            let code = codeString.split('borrowid')
            console.log('code', code)
            this.sanQrCodeSucc(code[1])
            return
          }

          if (res.result) {
            console.log('扫描结果 是 条形码', res)
            get(`isbn/${res.result}`, {}, false)
            .then(res => {
              console.log('扫描书本的 条形码请求接口返回', res)
              this.getIsbnSuss(res.msg)
            })
            .catch(e => {
              console.log('扫码 但是请求接口失败', e)
              this.getIsbnFail(e.msg)
            })
          }
        }
      })
    },
    sanQrCodeSucc(code = '') {
      let _this = this
      wx.showModal({
        title: '提示',
        content: '是否借阅此书',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            console.log('code id', code)
            _this.borrowBook(code)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    getIsbnSuss(msg = '') {
      let _this = this
      wx.showModal({
        title: '处理成功',
        content: msg,
        confirmText: '继续扫码',
        cancelText: '我的图书',
        success (res) {
          if (res.confirm) {
            _this.scanBook()
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.switchTab({
              url: '../../pages/comments/main'
            })
          }
        }
      })
    },
    getIsbnFail(msg = '') {
      let _this = this
      wx.showModal({
        title: '处理失败',
        content: msg,
        confirmText: '继续扫码',
        success (res) {
          if (res.confirm) {
            _this.scanBook()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  components: {
    YearProgress
  },
  onShow () {
    let userinfo = wx.getStorageSync('userinfo')
    this.userinfo = userinfo ? userinfo : {
      avatarUrl: '../../static/img/unlogin.png',
      nickName: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-container {
  position: fixed;
  top: 20rpx;
  right: 20rpx;
}
.container {
  padding: 0 30rpx;
  .userinfo {
    margin-top: 100rpx;
    text-align: center;
    img {
      width: 150rpx;
      height: 150rpx;
      margin: 20rpx;
      border-radius: 50%
    }
  }
}
.icon-container {
  display: flex;
  justify-content: center;
}
.tip {
  text-align: center;
}
</style>
