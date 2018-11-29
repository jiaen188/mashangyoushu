// 工具函数库
import config from './config'

// http get工具函数 获取数据
export function get (url, data, isShowLoading = true) {
  return request(url, 'GET', data, isShowLoading)
}

export function post (url, data, isShowLoading = true) {
  return request(url, 'POST', data, isShowLoading)
}

export function put (url, data, isShowLoading = true) {
  return request(url, 'PUT', data, isShowLoading)
}

function request (url, method, data, isShowLoading) {
  const token = wx.getStorageSync('token')
  const header = token ? {
    'authorization': `bearer ${token}`
  } : {}

  // 如果不是请求token的接口，或者没有token，就不继续请求
  if (url !== 'auth' && !token) {
    console.log('不是 auth， 且没有token')
    return new Promise((resolve, reject) => {
      reject(new Error('没有token'))
    })
  }

  isShowLoading && wx.showLoading({
    title: '加载中',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      url: config.host + url,
      header,
      success: function (res) {
        isShowLoading && wx.hideLoading()

        console.log('请求的结果 res', res)
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else if (res.data.code === 401) {
          console.log('401*****token过期', res)
          reLogin(res.data.msg)
        } else {
          reject(res.data)
        }
      },
      fail: function (e) {
        isShowLoading && wx.hideLoading()
        console.log('请求失败', e)
      }
    })
  })
}

function reLogin (msg) {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
  wx.clearStorageSync()
  setTimeout(() => {
    wx.reLaunch({
      url: '/pages/me/main'
    })
  }, 2000)
}

export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}

export function showSuccess (text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}
