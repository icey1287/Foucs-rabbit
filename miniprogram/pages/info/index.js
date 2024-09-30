Page({
  data: {
    currentDate: '',         // 当前日期
    currentMonth: '',        // 当前月份 
    currentYear: '',         // 当前年份 
    totalFocusTime: 0,      // 总学习时长
    totalStudyCount: 0,     // 总学习次数
    averageFocusTime: 0,    // 日均时长
    focusTime_day: 0,      //当日学习时长
    studyCount_day: 0,     //当日学习次数
    focusTime_month: 0,    //当月学习时长
    studyCount_month: 0,   //当月学习次数
    focusTime_year: 0,     //当年学习时间
    studyCount_year: 0     //当年学习次数
  },

  //前一天
  subtractDay: function() {
    const currentDate = this.data.currentDate;
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1); // 减去一天
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const day = newDate.getDate().toString().padStart(2, '0');
    const newCurrentDate = `${year}-${month}-${day}`;
    
    this.setData({
      currentDate: newCurrentDate,
    });

    this.getOpenIdAndQueryDate(this.data.currentDate);
  },

  // 后一天
  addDay: function() {
    const currentDate = this.data.currentDate;
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1); // 加上一天
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const day = newDate.getDate().toString().padStart(2, '0');
    const newCurrentDate = `${year}-${month}-${day}`;
    
    this.setData({
      currentDate: newCurrentDate,
    });

    this.getOpenIdAndQueryDate(this.data.currentDate);
  },

  // 前一个月
subtractMonth: function() {
  const currentMonth = this.data.currentMonth;
  const newDate = new Date(currentMonth + '-01'); // 将当前月份转换为日期
  newDate.setMonth(newDate.getMonth() - 1); // 减去一个月
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const newCurrentMonth = `${year}-${month}`;
  
  this.setData({
    currentMonth: newCurrentMonth,
  });

  this.getOpenIdAndQueryMonth(this.data.currentMonth);
},

// 后一个月
addMonth: function() {
  const currentMonth = this.data.currentMonth;
  const newDate = new Date(currentMonth + '-01'); // 将当前月份转换为日期
  newDate.setMonth(newDate.getMonth() + 1); // 加一个月
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const newCurrentMonth = `${year}-${month}`;
  
  this.setData({
    currentMonth: newCurrentMonth,
  });

  this.getOpenIdAndQueryMonth(this.data.currentMonth);
},

// 前一年
subtractYear: function() {
  const currentYear = this.data.currentYear;
  const newYear = parseInt(currentYear) - 1; // 减去一年
  
  this.setData({
    currentYear: newYear.toString(),
  });

  this.getOpenIdAndQueryYear(this.data.currentYear);
},

// 后一年
addYear: function() {
  const currentYear = this.data.currentYear;
  const newYear = parseInt(currentYear) + 1; // 加一年
  
  this.setData({
    currentYear: newYear.toString(),
  });

  this.getOpenIdAndQueryYear(this.data.currentYear);
},

// 获取 OpenID 并查询所有的学习记录
getOpenIdAndQueryAllStudy: function() {
  // 调用云函数获取 OpenID
  wx.cloud.callFunction({
    name: 'getopenid', 
    success: res => {
      const openId = res.result.openid; // 获取 openid
      this.queryAllStudy(openId); // 使用 openid 查询学习记录
    },
    fail: err => {
      console.error('获取 openid 失败:', err);
    }
  });
},

// 获取 OpenID 并查询某一天的学习记录
  getOpenIdAndQueryDate: function(targetDate) {
    // 调用云函数获取 OpenID
    wx.cloud.callFunction({
      name: 'getopenid', // 云函数名称，用于获取 openid
      success: res => {
        const openId = res.result.openid; // 获取 openid
        this.queryStudyByDate(openId, targetDate); // 使用 openid 查询学习记录
      },
      fail: err => {
        console.error('获取 openid 失败:', err);
      }
    });
  },

// 获取 OpenID 并查询某一个月的学习记录
getOpenIdAndQueryMonth: function(targetMonth) {
  wx.cloud.callFunction({
    name: 'getopenid',
    success: res => {
      const openId = res.result.openid;
      this.queryStudyByMonth(openId, targetMonth); // 使用 openid 查询学习记录
    },
    fail: err => {
      console.error('获取 openid 失败:', err);
    }
  });
},

// 获取 OpenID 并查询某一年的学习记录
getOpenIdAndQueryYear: function(targetYear) {
  wx.cloud.callFunction({
    name: 'getopenid',
    success: res => {
      const openId = res.result.openid;
      this.queryStudyByYear(openId, targetYear); // 使用 openid 查询学习记录
    },
    fail: err => {
      console.error('获取 openid 失败:', err);
    }
  });
},

queryStudyByDate: function(openId, targetDate) {
  const db = wx.cloud.database();

  // 获取目标日期的开始和结束时间戳
  const startOfDay = new Date(targetDate).setHours(0, 0, 0, 0); // 一天的开始时间
  const endOfDay = new Date(targetDate).setHours(23, 59, 59, 999); // 一天的结束时间

  db.collection('focus').where({
    openId: openId,
    date_stamp: db.command.gte(startOfDay).and(db.command.lte(endOfDay)) // 时间范围查询
  }).get({
    success: res => {
      let totalFocusTimeInSeconds = 0;
      let studyCount = res.data.length; // 学习次数

      // 累加学习时间
      res.data.forEach(record => {
        totalFocusTimeInSeconds += record.focusTime; //默认数据库中focusTime单位为分钟
      });

      // 设置查询结果到页面数据
      this.setData({
        focusTime_day: totalFocusTimeInSeconds,  
        studyCount_day: studyCount               
      });
    },

    fail: err => {
      wx.showToast({
        title: '查询失败',
        icon: 'none'
      });
      console.error('查询失败:', err);
    }
  });
},

// 查询某一个月的学习记录
queryStudyByMonth: function(openId, targetMonth) {
  const db = wx.cloud.database();

  // 将 targetMonth 转换为对应的开始日期和结束日期
  const [year, month] = targetMonth.split('-'); // "YYYY-MM"

  // 获取该月的第一天和最后一天的时间戳
  const startOfMonth = new Date(year, month - 1, 1).getTime(); // 当月第一天的时间戳
  const endOfMonth = new Date(year, month, 1).getTime() - 1; // 下个月第一天的前一毫秒

  db.collection('focus').where({
    openId: openId,
    date_stamp: db.command.gte(startOfMonth).and(db.command.lte(endOfMonth)) // 时间戳范围查询
  }).get({
    success: res => {
      let totalFocusTimeInSeconds = 0;
      let studyCount = res.data.length; // 学习次数

      // 累加学习时间
      res.data.forEach(record => {
        totalFocusTimeInSeconds += record.focusTime; //默认数据库中focusTime单位为分钟
      });

      // 设置查询结果到页面数据
      this.setData({
        focusTime_month: totalFocusTimeInSeconds,
        studyCount_month: studyCount
      });
    },

    fail: err => {
      wx.showToast({
        title: '查询失败',
        icon: 'none'
      });
      console.error('查询失败:', err);
    }
  });
},

// 查询某一年的学习记录
queryStudyByYear: function(openId, targetYear) {
  const db = wx.cloud.database();

  // 获取该年第一天和最后一天的时间戳
  const startOfYear = new Date(targetYear, 0, 1).getTime(); // 当年第一天的时间戳
  const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999).getTime(); // 当年最后一天的时间戳

  db.collection('focus').where({
    openId: openId,
    date_stamp: db.command.gte(startOfYear).and(db.command.lte(endOfYear)) // 时间戳范围查询
  }).get({
    success: res => {
      let totalFocusTimeInSeconds = 0;
      let studyCount = res.data.length; // 学习次数

      // 累加学习时间
      res.data.forEach(record => {
        totalFocusTimeInSeconds += record.focusTime; //默认数据库中focusTime单位为分钟
      });

      // 设置查询结果到页面数据
      this.setData({
        focusTime_year: totalFocusTimeInSeconds,
        studyCount_year: studyCount
      });
    },

    fail: err => {
      wx.showToast({
        title: '查询失败',
        icon: 'none'
      });
      console.error('查询失败:', err);
    }
  });
},

queryAllStudy: function(openId) {
  const db = wx.cloud.database();

  db.collection('focus').where({
    openId: openId
  }).get({
    success: res => {
      let totalFocusTimeInSeconds = 0;
      let studyCount = res.data.length; // 学习次数
      let studyDays = new Set(); // 用于存储学习的日期

      // 累加学习时间并记录学习日期
      res.data.forEach(record => {
        totalFocusTimeInSeconds += record.focusTime; //默认数据库中focusTime单位为分钟
        const date = new Date(record.date_stamp).toISOString().split('T')[0]; // 使用时间戳获取日期部分
        studyDays.add(date); // 将日期加入集合
      });

      const uniqueStudyDays = studyDays.size; // 不同学习天数
      const averageFocusTime = studyCount > 0 ? totalFocusTimeInSeconds / uniqueStudyDays : 0; // 日均时长

      // 设置查询结果到页面数据
      this.setData({
        totalFocusTime: totalFocusTimeInSeconds,  
        totalStudyCount: studyCount,               
        averageFocusTime: averageFocusTime         
      });
    },

    fail: err => {
      wx.showToast({
        title: '查询失败',
        icon: 'none'
      });
      console.error('查询失败:', err);
    }
  });
},

// 页面加载
onLoad: function() {
  this.initializeDate(); // 初始化日期和数据
},

 // 初始化日期和数据的函数
 initializeDate: function() {
  const now = new Date(); // 获取当前日期
  this.setData({
    currentDate: now.toISOString().split('T')[0], // "YYYY-MM-DD"
    currentMonth: now.toISOString().split('T')[0].slice(0, 7), // "YYYY-MM"
    currentYear: now.getFullYear().toString() // "YYYY"
  });
  this.getOpenIdAndQueryDate(this.data.currentDate); 
  this.getOpenIdAndQueryMonth(this.data.currentMonth); 
  this.getOpenIdAndQueryYear(this.data.currentYear); 
  this.getOpenIdAndQueryAllStudy();
},

// 下拉刷新页面恢复到当前日期的数据
onPullDownRefresh: function() {
  this.initializeDate();  // 重新初始化当前日期和数据
  wx.stopPullDownRefresh(); // 停止下拉刷新
},

});
