Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,  
    openId: '',
    avatarUrl: '', 
    nickName: '',  
    sumFocusTime: 0,  
    gold: 0, 
    creationDate: '', 
    cellList: [
        {
            url: '../../images/quit.png',
            text: '退出登录'
        }
    ],
    isEditingNickName: false // 是否在编辑昵称状态
},

// 点击输入框时的事件
onNickNameFocus(e) {
    this.setData({
        isEditingNickName: true
    });
},

// 当输入框失焦时的事件
onNickNameBlur(e) {
    const newNickName = e.detail.value.trim() || '点我修改昵称'; // 获取输入的值，如果为空则设置默认值
    this.setData({
        nickName: newNickName,
        isEditingNickName: false
    });

    // 更新数据库中的昵称
    this.updateNickNameInDB(newNickName);
},

// 更新昵称到云数据库
updateNickNameInDB(nickName) {
    const openId = wx.getStorageSync('openId');
    const db = wx.cloud.database();

    db.collection('users').where({
        _openid: openId
    }).update({
        data: {
            nickName: nickName
        }
    }).then(res => {
        console.log('昵称更新成功');
    }).catch(err => {
        console.error('昵称更新失败：', err);
    });
},


  // 登录函数
  toLogin() {
    wx.getUserProfile({
        desc: '获取用户信息',
        success: (res) => {
            console.log(res);
            const { userInfo: { avatarUrl, nickName } } = res;
            const userInfo = {
                avatarUrl,
                nickName
            };
            wx.setStorageSync('userInfo', userInfo);  // 将用户信息存储
            wx.setStorageSync('login', true);  // 设置登录状态

            // 更新数据
            this.setData({
                login: true,
            });

            // 获取 openId 并存储到 data
            wx.cloud.callFunction({
                name: 'getopenid', // 云函数名称
                success: res => {
                    const openId = res.result.userInfo.openId;
                    wx.setStorageSync('openId', openId);  // 保存 openId 到本地
                    this.setData({
                        openId: res.result.userInfo.openId
                    });
                    
                    // 加载用户的其他信息（包括昵称）
                    this.loadUserData();

                    // 把 openId 传到全局变量
                    getApp().globalData.openId = openId;
                },
                fail: err => {
                    console.error('获取 openId 失败：', err);
                }
            });
        }
    });
},


  // 退出登录函数
  toDetail(e) {
      const { page } = e.currentTarget.dataset;
      if (!page) {
          wx.showModal({
            title: '提示',
            content: '确定退出吗?',
            success: (res) => {
                const { confirm } = res;
                if (confirm) {
                    wx.removeStorageSync('login');
                    wx.removeStorageSync('userInfo');
                    getApp().globalData.openId = null;
                    this.setData({
                        login: false,
                        avatarUrl: '',
                        nickName: '',
                        sumFocusTime: 0,
                        gold:0,
                        creationDate: ''
                    });
                }
            }
          });
      }
  },

  // 从云数据库加载用户信息（专注时长、小组、创建账号日期）
  loadUserData() {
    const openId = wx.getStorageSync('openId');
    const db = wx.cloud.database();

    db.collection('users').where({
        _openid: openId
    }).get().then(res => {
        if (res.data.length > 0) {
            const userData = res.data[0];
            this.setData({
                sumFocusTime: userData.sumFocusTime || 0,
                creationDate: userData.creationDate || '未知',
                gold: userData.gold || 0,
                avatarUrl: userData.avatarUrl || '/images/avatar_default.png', // 如果没有头像，显示默认头像
                nickName: userData.nickName || '点我修改昵称' // 如果没有昵称，显示默认昵称
            });
        } else {
            const date = new Date();
            const creationDate = date.toLocaleDateString();

            // 如果没有找到用户信息，则创建新的用户数据
            db.collection('users').add({
                data: {
                    openId: openId,
                    sumFocusTime: 0,
                    gold: 0,
                    creationDate: creationDate,
                    avatarUrl: '/images/avatar_default.png', // 默认头像
                    nickName: '点我修改昵称' // 设置默认昵称
                }
            }).then(res => {
                console.log('创建用户数据成功');
                this.setData({
                    sumFocusTime: 0,
                    gold: 0,
                    creationDate: creationDate,
                    avatarUrl: '/images/avatar_default.png',
                    nickName: '点我修改昵称' // 设置默认昵称
                });
            }).catch(err => {
                console.error('创建用户数据失败：', err);
            });
        }
    }).catch(err => {
        console.error('查询用户数据失败：', err);
    });
},



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const login = wx.getStorageSync('login');
    const userInfo = wx.getStorageSync('userInfo');
    const openId = wx.getStorageSync('openId');
    
    if (userInfo) {
        const { avatarUrl, nickName } = userInfo;
        this.setData({
            avatarUrl: avatarUrl || '/images/avatar_default.png', // 如果没有头像，显示默认头像
            nickName
        });
    }

    this.setData({
        login: !!login,
        openId: openId || ''
    });

    if (login && openId) {
        this.loadUserData();
        getApp().globalData.openId = openId;
    }
},


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
          this.getTabBar().setData({
              select: 4
          });
      }
  },
    // 跳转到 info 页面
    navigateToInfo() {
      wx.switchTab({
          url: '../info/index'
      });
  },

  // 跳转到历史记录页面
  navigateToHistory() {
    wx.navigateTo({
        url: '../history/index'
    });
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    const openId = wx.getStorageSync('openId');
    
    // 将头像上传到云存储
    wx.cloud.uploadFile({
        cloudPath: `avatars/${openId}-${Date.now()}.png`, // 云存储路径
        filePath: avatarUrl, // 本地文件路径
        success: res => {
            const fileID = res.fileID; // 云文件ID

            // 更新页面的头像显示
            this.setData({
                avatarUrl: fileID
            });

            // 将头像URL保存到数据库
            const db = wx.cloud.database();
            db.collection('users').where({
                _openid: openId
            }).update({
                data: {
                    avatarUrl: fileID
                }
            }).then(res => {
                console.log('头像更新成功');
            }).catch(err => {
                console.error('头像更新失败：', err);
            });
        },
        fail: err => {
            console.error('头像上传失败：', err);
        }
    });
}

});