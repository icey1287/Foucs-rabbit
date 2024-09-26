// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['5s', '25min','40min','60min','自定义'],
    tabList_min: ['0', '25','40','60','0'],
    tabList_sec:['5','0','0','0','0'],
    select: 0,
  },
  getTab(e) {
    const select = e.detail;
    console.log("已选中",select)
    this.setData({
        select
    })
    console.log("已更新",this.data.select)
    this.onLoad();
  },
  startFocus(focus_target_time){
  // wx.navigateTo({
  //     url: '../focusing/index'+"?min="+this.data.tabList_min[this.data.select]+"&sec="+this.data.tabList_sec[this.data.select],
  //     // success:(res)=>{
	// 		// 	res.eventChannel.emit('args',{focus_target_time:this.data.tabList_min[this.data.select]})
	// 		// }
  //   });
    wx.reLaunch({
      url: '../focusing/index'+"?min="+this.data.tabList_min[this.data.select]+"&sec="+this.data.tabList_sec[this.data.select],
    })
  },
CloudFunctionTest(){
    wx.cloud.callFunction({
      name: 'help',
      data: {
        data:"I am Data"
      },
      success: function(res) {
        console.log("success callback:",res.result)
      },
      fail: console.error
    });
    // wx.getUserProfile({ desc:'', success:(res)=>{ console.log(res); }});
    // wx.getUserInfo()
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      console.log("ONLOAD");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
      console.log("onReady");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
      console.log("onShow");
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