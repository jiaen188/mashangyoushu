// 工具函数库
import config from './config'

// http get工具函数 获取数据
export function get (url, data) {
  return request(url, 'GET', data)
}

export function post (url, data) {
  return request(url, 'POST', data)
}

function request (url, method, data) {
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

  wx.showLoading({
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
        wx.hideLoading()

        console.log('请求的结果 res', res)
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (e) {
        wx.hideLoading()
        console.log('请求失败', e)
      }
    })
  })
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
