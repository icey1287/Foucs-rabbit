const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    isLoggedIn: false,
    userInfo: {},
    focusTime: 0,      // 累计专注时长
    group: '',         // 小组
    creationDate: '',  // 创建账号日期
  },

  onLoad() {
    // 检查是否已经登录
    if (app.globalData.userInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo: app.globalData.userInfo,
      });
      this.loadUserData(); // 加载用户的专注时长等信息
    }
  },

  // 登录逻辑
  onLogin(e) {
    if (e.detail.userInfo) {
      // 保存用户信息
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        isLoggedIn: true,
        userInfo: e.detail.userInfo,
      });

      // 获取用户数据
      this.loadUserData();

      console.log('用户登录成功：', e.detail.userInfo);
    } else {
      console.log('用户拒绝登录');
    }
  },

  // 从云数据库加载用户数据
  loadUserData() {
    const openId = app.globalData.openId; // 通过小程序获取用户的 openId

    // 从云数据库中获取用户的专注时长、小组、创建账号日期等信息
    db.collection('users').where({ _openid: openId }).get().then(res => {
      if (res.data.length > 0) {
        const userData = res.data[0];
        this.setData({
          focusTime: userData.focusTime || 0,
          group: userData.group || '未分组',
          creationDate: userData.creationDate || '未知',
        });
      }
    }).catch(err => {
      console.error('获取用户数据失败：', err);
    });
  },

  // 退出逻辑
  onLogout() {
    app.globalData.userInfo = null;
    this.setData({
      isLoggedIn: false,
      userInfo: {},
      focusTime: 0,
      group: '',
      creationDate: '',
    });
    console.log('用户已退出');
  }
});
