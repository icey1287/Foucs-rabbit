// pages/pet/index.js
Page({

  /**
   * 页面的初始数据
   */
  data:
   {
    totalStudyCount: 0, //总学习时长
    totalGold:7000,//总金币数
    isdetailed:false,//是否进入详情界面
    currentPet:{},
    pets: 
    [
      { name: '萝卜猫',image0:'/images/larval_radishCat.png', image: '/images/radishCat.png' ,image1:'/images/adult_radishCat.png',state:1},
      { name: '萝卜狗', image0:'/images/larval_radishDog.png',image: '/images/radishDog.png',image1:'/images/adult_radishDog.png',state:0 },
    ],
  },
  Buy(e)
  {
    const that=this;
    const index = e.currentTarget.dataset.index;
    if(this.data.totalGold<500)
    {
      wx.showToast
      ({
        title: '金币不足请进行专注获取金币',
        icon:'none'
      })
      return ;
    }
    wx.showModal({
      title: '确认购买',
      content: '您确认要花费500金币购买该宠物吗',
      success(res)
      {
        if(res.confirm)
        {
          that.purchase(index);
        }
      }
    })
  },
  purchase(index)
  {
    const newPets=[...this.data.pets];
    newPets[index].state=1;
    this.setData({
      pets: newPets,
      totalGold:this.data.totalGold-500,
      
    })
    wx.showToast({
      title: '购买成功！',
      icon:'success'
    })
  },
  Search(e)
  {
    const index = e.currentTarget.dataset.index;
    const pet = this.data.pets[index];
    this.setData({
        isdetailed: true,
        currentPet: { ...pet } // 保存当前宠物信息
      });
  },
  upgradePet() 
  {
    if (this.data.totalGold < 500 )
    {
      wx.showToast({
        title: '金币不足，无法升级！',
        icon: 'none'
      });
      return;
    }
    const updatedPet = { 
      ...this.data.currentPet, // 克隆当前宠物
      state: this.data.currentPet.state + 1 // 增加等级
    };
    const updatedPets = this.data.pets.map(pet => 
      pet.name === updatedPet.name ? updatedPet : pet);
    // 调用 setData 来更新状态
    this.setData({
      totalGold: this.data.totalGold -500, // 扣除金币
      currentPet: updatedPet, // 更新宠物等级
      pets: updatedPets
    })
    // 显示升级成功提示
    wx.showToast({
      title: '升级成功！',
      icon: 'success'
    });
  },
  cancelTraining() 
  {
    this.setData({
      isdetailed: false,
      currentPet: {},
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) 
  {

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
  onShareAppMessage() 
  {

  }
})