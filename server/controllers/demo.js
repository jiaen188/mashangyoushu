module.exports = async (ctx) => {
    console.log('现在不用这个页面了')
    ctx.state.data = {
        msg: 'hello 小程序后台'
    }
}
