// pages/home/index.js
const app = getApp();
const fs = wx.getFileSystemManager()
const bgPicCloudPath = app.globalData.bgPicCloudPath;
const bgMucCloudPath = app.globalData.bgMucCloudPath;
const petImgPath={
  "宠物猫":[
"/images/larval_radishCat.png",
"/images/radishCat.png",
"/images/adult_radishCat.png"
  ],
  "宠物狗":[
"/images/larval_radishDog.png",
"/images/radishDog.png",
"/images/adult_radishDog.png"
  ]
}
Page({
  /****************************************************/
  getTab(e) {
    const select = e.detail;
    this.setData({ select: select.index });
    console.log("home:select:", select)
  },
  selectPet: function (e) {
    this.data.selectPetIndex = Number(e.detail.value)
  },
  startFocus() {
    let openid = app.globalData["openId"];
    if (openid == undefined || openid == null) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: (res) => {
          // app.globalData["openId"] = "todo!";
          wx.switchTab({
            url: '../me/index',
          })
        }
      });
    } else {
      let petImagePath;
      if(this.data.selectPetIndex){
        let pet = this.data.allPetList[this.data.selectPetIndex]
        let level = this.data.allPetLevel[pet]
        if(level<5){
          petImagePath=petImgPath[pet][0]
        }else if(level<10){
          petImagePath=petImgPath[pet][1]
        }else{
          petImagePath=petImgPath[pet][2]
        }
      }
      console.log("petPath",petImagePath)
      let url = '../focusing/index' +
        "?min=" + this.data.tabList_min[this.data.select] +
        "&sec=" + this.data.tabList_sec[this.data.select] +
        (
          this.data.selectPetIndex ?
            "&petName=" + this.data.allPetList[this.data.selectPetIndex] : ''
        )+
        (
          this.data.selectPetIndex ?
            "&petImage="+petImagePath:''
            // "&petImage=" + this.data.allPetList[this.data.selectPetIndex] : ''//TODO宠物图片路径
        )
        ;
      console.log("home:ralunch.url:", url);
      wx.reLaunch({
        url: url,
        fail: function () {
          console.log("home:", "跳转至focus失败")
        }
      })
    }
  },
  getPetInfoFromCloudDb(){
    const dbname = 'pet';
    const db = wx.cloud.database();
    const _ = db.command
    db.collection(dbname).get()
   let result =  wx.cloud.database().collection('pet').where({
     _openid:getApp().globalData.openId
   }).field(({
        "cat_state":true,
        "dog_state":true,
        "totalGold":true,
    })).get({success:res=>{
      let data = res.data;
      if(data.length==0){
        console.log("length=0")
        return;
      }else{
        let allpetlist = ["无宠物"]
        let data2 = data[0];
        console.log("length!=0",data2)
        if(data2["cat_state"]!=0){
          this.data.allPetLevel["宠物猫"]=data2["cat_state"]
        console.log("cat",data2["cat_state"])
          allpetlist.push("宠物猫")
        }
        if(data2["dog_state"]!=0){
          this.data.allPetLevel["宠物狗"]=data2["dog_state"]
          allpetlist.push("宠物狗")
        }
        this.setData({allPetList:allpetlist})
      }
    }})
    // console.log("pet:",result);
  },
  downloadRes() {
    //Pic
    Object.keys(bgPicCloudPath).forEach(key => {
      // console.log(key,bgPicCloudPath[key].url);
      let url = bgPicCloudPath[key].url;
      this.downloadSingle(key, url);
    });
    Object.keys(bgMucCloudPath).forEach(key => {
      // console.log(key,bgMucCloudPath[key].url);
      let url = bgMucCloudPath[key].url;
      this.downloadSingle(key, url);
    })
  },
  //从缓存[key]获取路径,判断文件是否存在,不存在则下载,return bool
  downloadSingle(key, url) {
    let cache = wx.getStorageSync(key);
    if (cache != null && cache != undefined) {
      try {
        fs.accessSync(cache);
        console.log('home:读取旧的本地缓存文件:' + cache + '成功');
        return;
      } catch (e) {
        console.log('home:读取旧的本地缓存文件:' + String(cache) + '失败,将重新下载.', String(e));
      }
    }
    wx.cloud.downloadFile({
      fileID: url,
      success: function (res) {
        if (res.statusCode === 200) {
          let tempFilePath = res.tempFilePath;
          fs.saveFile({
            tempFilePath: tempFilePath,
            success: function (res) {
              let savedFilePath = res.savedFilePath;
              wx.setStorageSync(key, savedFilePath);
              console.log('home:保存文件:' + key + 'url:' + url + '到本地缓存' + savedFilePath + '成功');
            },
            fail: function (res) {
              console.log('home:保存文件:' + key + 'url:' + url + '到本地缓存失败', res);
            }
          });
        }
      },
      fail: function (res) {
        console.log('home:下载文件:' + key + ' url:' + url + '失败', res);
      }
    });
  },
  /****************************************************/
  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['5', '25', '40', '60', '120'],
    tabList_min: ['0', '25', '40', '60', '120'],
    tabList_sec: ['5', '0', '0', '0', '0'],
    allPetList: ["无宠物"],
    allPetLevel:{
      "宠物猫":0,
      "宠物狗":0
    },
    selectPetIndex: 0,
    select: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.downloadRes();
    // this.getPetInfoFromCloudDb()
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
  this.getPetInfoFromCloudDb()
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