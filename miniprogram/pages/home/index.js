// pages/home/index.js
const app = getApp();
Page({
  /****************************************************/
  getTab(e) {
    const select = e.detail;
    console.log("已选中", select)
    this.setData({
      select
    })
    console.log("已更新", this.data.select)
    this.onLoad();
  },
  startFocus() {
    // wx.navigateTo({
    //     url: '../focusing/index'+"?min="+this.data.tabList_min[this.data.select]+"&sec="+this.data.tabList_sec[this.data.select],
    //     // success:(res)=>{
    // 		// 	res.eventChannel.emit('args',{focus_target_time:this.data.tabList_min[this.data.select]})
    // 		// }
    //   });
    let openid = app.globalData["openId"];
    if (openid == undefined || openid == null) {
      wx.showModal({
        title: '提示',
        content: 'Please login',
        showCancel: false,
        success: (res) => {
          // app.globalData["openId"] = "todo!";
          wx.switchTab({
            url: '../me/index',
          })
        }
      });
    } else {
      wx.reLaunch({
        url: '../focusing/index' + "?min=" + this.data.tabList_min[this.data.select] + "&sec=" + this.data.tabList_sec[this.data.select],
      })
    }
  },
  CloudFunctionTest() {
    this.upsertFocus(60)
  },

  getUserInfoByOpenId: function (openid) {//TODO
    const dbname = 'users';
    const db = wx.cloud.database();
    const _ = db.command
  },
  /****************************************************/
  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['5s', '25min', '40min', '60min', '自定义'],
    tabList_min: ['0', '25', '40', '60', '0'],
    tabList_sec: ['5', '0', '0', '0', '0'],
    select: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})