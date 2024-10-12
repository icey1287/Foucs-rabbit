Page({
  data: {
      historyRecords: []
  },

  onLoad() {
      this.loadHistoryRecords();
  },

  // 加载历史记录
  loadHistoryRecords() {
      const openId = wx.getStorageSync('openId');
      const db = wx.cloud.database();

      // 查询与当前 openId 匹配的历史记录
      db.collection('focus').where({
          _openid: openId
      }).get().then(res => {
          const records = res.data.map(record => {
              // 将时间戳转换为日期格式
              const date = new Date(record.date_stamp);
              const formattedDate = this.formatDate(date);  // 自定义格式化函数

              return {
                  date: formattedDate,
                  focusTime: record.focusTime
              };
          });

          // 更新页面数据
          this.setData({
              historyRecords: records
          });
      }).catch(err => {
          console.error('加载历史记录失败:', err);
      });
  },

  // 格式化时间戳为日期字符串
  formatDate(date) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // 保证两位数
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
});
