<template>
  <div class="container">
    <div class="userinfo" @click="login">
      <img :src="userinfo.avatarUrl" alt="">
      <p>{{userinfo.nickName}}</p>
    </div>
    <YearProgress></YearProgress>

    <div v-if="userinfo.nickName" @click="scanBook" class="icon-container">
      <i-icon type="scan" size="100"></i-icon>
    </div>

    <!-- <button v-if="userinfo.openId" @click="scanBook" class="btn">添加图书</button> -->
    <!-- <button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">点击登录</button> -->
    <!-- <button v-if="userinfo.nickName" @click="scanBook" class="btn">添加图书</button> -->
    <button v-else type="defalut" open-type="getUserInfo" class='btn' @getuserinfo="onGetUserInfo">授权登陆</button>
    <div class="tip">点我扫一扫</div>
    <button v-if="userinfo.nickName" class="btn" @click="clearHistory">清空缓存</button>
  </div>
</template>

<script>
import YearProgress from '../../components/YearProgress.vue'
import { showSuccess, showModal, post } from '../../util'
import qcloud from 'wafer2-client-sdk'
import config from '../../config.js'

export default {
  data () {
    return {
      userinfo: {
        avatarUrl: '../../../static/img/unlogin.png',
        nickName: ''
      },
      token: '',
      books: 0
    }
  },
  methods: {
    clearHistory() {
      wx.clearStorage()
      this.userinfo = {
        avatarUrl: '../../../static/img/unlogin.png',
        nickName: ''
      }
      this.token = ''
    },
    onGetUserInfo(e) {
      console.log(e)
      if (e.target.userInfo) {
        this.userinfo.nickName = e.mp.detail.userInfo.nickName
        this.userinfo.avatarUrl = e.mp.detail.userInfo.avatarUrl

        wx.setStorageSync('userinfo', this.userinfo)

        let _this = this

        console.log('nickname', this.userinfo.nickName)

        wx.request({
          url: `http://hm2.hwd.cn/api/v1/auth?username=${this.userinfo.nickName}`,
          success(res) {
            console.log(res)
            if (res.data.code === 0) {
              wx.setStorageSync('token', res.data.data.token)
              _this.token = res.data.data.token
              console.log('this.toek', res.data.data.token)
            }
          }
        })
      }
    },
    borrowBook(id) {
      let _this = this
      console.log('borrow *********')
      if (this.token) {
        wx.request({
          method: 'post',
          url: `http://hm2.hwd.cn/api/v1/borrow/${id}`,
          header: {
            'authorization': `bearer ${this.token}`
          },
          success(res) {
            console.log('borrowBook',res)
            if (res.data.code === 0) {
              wx.showToast({
                title: '借书成功',
                icon: 'success'
              })
            }
          }
        })
      }
    },
    scanBook () {
      let _this = this
      wx.scanCode({
        success: (res) => {

          if (res.result.indexOf('borrowid') > -1) {
            let codeString = res.result
            let code = codeString.split('borrowid')
            wx.showModal({
              title: '提示',
              content: '是否借阅此书',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  // setInterval(_this.borrowBook(code[2]))
                  _this.borrowBook(code[2])
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return
          }

          if (res.result) {
            console.log('扫描结果', res)
            const token = wx.getStorageSync('token')
            wx.request({
              url: `http://hm2.hwd.cn/api/v1/isbn/${res.result}`,
              header: {
                'authorization': `bearer ${token}`
              },
              success(res) {
                console.log(res)
                // 添加图书后 的返回
                if (res.data.code === 0 ) {
                  showSuccess('添加成功')
                  wx.showModal({
                    title: '处理成功',
                    content: res.data.msg,
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
                } else {
                  console.log('err')
                  wx.showModal({
                    title: '处理失败',
                    content: res.data.msg,
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
              }
            })
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
    if (userinfo) {
      this.userinfo = userinfo
    }
  }
}
</script>

<style lang="scss" scoped>
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
