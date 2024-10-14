// pages/pet/index.js
const app = getApp();  //引入小程序实例，以获取全局变量
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data:
   {
    totalStudyCount: 0, //总学习时长
    totalGold:1000,//总金币数
    isdetailed:false,//是否进入详情界面
    currentPet:{},
    pets: 
    [
      { Name:'萝卜猫',name: 'cat',image0:'/images/larval_radishCat.png', image: '/images/radishCat.png' ,image1:'/images/adult_radishCat.png',state:0},
      { Name:'萝卜狗',name: 'dog', image0:'/images/larval_radishDog.png',image: '/images/radishDog.png',image1:'/images/adult_radishDog.png',state:0 },
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
    const openId = wx.getStorageSync('openId');
    const db = wx.cloud.database();
    newPets[index].state=1;
    this.setData({
      pets: newPets,
      totalGold:this.data.totalGold-500,
    })
    wx.showToast({
      title: '购买成功！',
      icon:'success'
    })
    const updateData = {};
    if (index === 0) {
        updateData.cat_state = 1; // 更新猫的状态
    } else if (index === 1) {
        updateData.dog_state = 1; // 更新狗的状态
    }
    db.collection('pet').where({
        _openid: openId
    }).update({
        data: {
            totalGold: this.data.totalGold - 500, // 确保更新后的金币数
            ...updateData // 动态添加更新的状态
        }
    }).then(res => {
        console.log('数据库更新成功:', res);
    }).catch(err => {
        console.error('数据库更新失败:', err);
    });

    db.collection('users').where({
      _openid: openId
  }).update({
      data: {
          gold: this.data.totalGold, // 确保更新后的金币数
          ...updateData // 动态添加更新的状态
      }
  }).then(res => {
      console.log('数据库更新成功:', res);
  }).catch(err => {
      console.error('数据库更新失败:', err);
  });
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
    
    // 更新云数据库
    const openId = wx.getStorageSync('openId');
    const db = wx.cloud.database();
    db.collection('pet').where({
        _openid: openId
    }).update({
        data: {
            totalGold: this.data.totalGold - 500, // 更新后的金币数
            [`${updatedPet.name}_state`]: updatedPet.state // 动态更新宠物状态
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.error(err);
    });

    db.collection('users').where({
      _openid: openId
  }).update({
      data: {
          gold: this.data.totalGold , // 更新后的金币数
        
      }
  }).then(res => {
      console.log(res);
  }).catch(err => {
      console.error(err);
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
  onLoad: function() 
  {
    this.getUserOpenIdAndData();  // 页面加载时获取用户数据
  },
  getUserOpenIdAndData() {
    const openId = wx.getStorageSync('openId');
    const db = wx.cloud.database();
    db.collection('pet').where({
        _openid: openId
    }).get().then(res => {
        if (res.data.length > 0) {
            const userData = res.data[0];
            this.setData({
                pets: [
                  { ...this.data.pets[0], state: userData.cat_state }, // 更新第一个宠物的状态
                  { ...this.data.pets[1], state: userData.dog_state }  // 更新第二个宠物的状态
               ] 
            });
        } else {

            // 如果没有找到用户信息，则创建新的用户数据
            db.collection('pet').add({
                data: {
                    _openid_1: openId,
                    totalGold:0,
                    cat_state:0,
                    dog_state:0,
                }
            }).catch(err => {
              console.error('创建用户数据失败：', err);
          });

          
      }
  }).catch(err => {
      console.error('查询用户数据失败：', err);
  })

  db.collection('users').where({
    _openid: openId
}).get().then(res => {
    if (res.data.length > 0) {
        const userData = res.data[0];
        this.setData({
            totalGold: userData.gold,
          
        });
    } else {

        // 如果没有找到用户信息，则创建新的用户数据
        db.collection('pet').add({
            data: {
                _openid_1: openId,
                totalGold:0,
                cat_state:0,
                dog_state:0,
            }
        }).catch(err => {
          console.error('创建用户数据失败：', err);
      });

      
  }
}).catch(err => {
  console.error('查询用户数据失败：', err);
})
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