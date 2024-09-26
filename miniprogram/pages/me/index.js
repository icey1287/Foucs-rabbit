Page({

  /**
   * 页面的初始数据
   */
  data: {
      login: false,  // 是否登录
      openId: '',
      avatarUrl: '', // 头像
      nickName: '',  // 昵称
      focusTime: 0,  // 累计专注时长
      group: '',     // 小组
      creationDate: '', // 创建账号日期
      cellList: [
          {
              url: '../../images/quit.png',
              text: '退出登录'
          }
      ]
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
            }
            wx.setStorageSync('userInfo', userInfo);  // 将用户信息存储
            wx.setStorageSync('login', true);  // 设置登录状态

            // 更新数据
            this.setData({
                login: true,
                avatarUrl,
                nickName
            });

            // 获取 openId 并存储到 data
            console.log("CCCCC")
            wx.cloud.callFunction({
              name: 'getopenid', // 云函数名称
              success: res => {
                  const openId = res.result.userInfo.openId;
                  wx.setStorageSync('openId', openId);  // 保存 openId 到本地
                  this.setData({
                      openId:res.result.userInfo.openId
                  });
                  console.log("CCCCC",res)
                  // 加载用户其他信息
                  this.loadUserData();
                  //把openid传到全局变量
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
                        focusTime: 0,
                        group: '',
                        creationDate: ''
                    });
                }
            }
          });
      }
  },

  // 从云数据库加载用户信息（专注时长、小组、创建账号日期）
  loadUserData() {
      const openId = wx.getStorageSync('openId');  // 

      const db = wx.cloud.database();

// 先查询数据库
        db.collection('users').where({
            _openid: openId
        }).get().then(res => {
            // 如果查询结果中有数据
            if (res.data.length > 0) {
                const userData = res.data[0];
                // 将用户数据设置到页面上
                this.setData({
                    focusTime: userData.focusTime || 0,
                    group: userData.group || '未分组',
                    creationDate: userData.creationDate || '未知',
                });
            } else {
                // 如果没有对应的用户数据，则创建新用户数据
                const date = new Date();
                const creationDate = date.toLocaleDateString(); // 将日期格式化为年月日
                
                db.collection('users').add({
                    data: {
                        openId: openId,
                        focusTime: 0,
                        group: '未分组',
                        creationDate: creationDate // 保存格式化后的日期
                    }
                }).then(res => {
                    console.log('创建用户数据成功：', res);
                    // 创建成功后，将初始化的数据设置到页面上
                    this.setData({
                        focusTime: 0,
                        group: '未分组',
                        creationDate: creationDate // 设置格式化后的日期
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
              avatarUrl,
              nickName
          });
      }

      // 检查登录状态
      this.setData({
        login: !!login,
        openId: openId || ''
    });

    // 如果已登录并且有 openId，加载用户数据
    if (login && openId) {
        this.loadUserData();
    }
    console.log("AAAAAAAAAA")
    console.log(this.data.openId)
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
  }
});
