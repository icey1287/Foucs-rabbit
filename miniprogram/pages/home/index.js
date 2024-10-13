// pages/home/index.js
const app = getApp();
Page({
  /****************************************************/
  getTab(e) {
    const select = e.detail;
    this.setData({ select: select.index });
    console.log("home:select:", select)
  },
  selectPet: function (e) {
    this.data.selectPetIndex= Number(e.detail.value)
  },
  startFocus() {
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
      let url = '../focusing/index' +
          "?min=" + this.data.tabList_min[this.data.select] +
          "&sec=" + this.data.tabList_sec[this.data.select] +
          (
            this.data.selectPetIndex ?
              "&petName=" + this.data.allPetList[this.data.selectPetIndex] : ''
          );
          console.log("home:ralunch.url:",url);
      wx.reLaunch({
        url:url, 
        fail: function () {
          console.log("focus:", "跳转至主页失败")
        }
      })
    }
  },
  /****************************************************/
  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['5', '25', '40', '60', '120'],
    tabList_min: ['0', '25', '40', '60', '120'],
    tabList_sec: ['5', '0', '0', '0', '0'],
    allPetList: ["无宠物", "萝卜猫", "萝卜狗"],
    selectPetIndex: 0,
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

  },

})