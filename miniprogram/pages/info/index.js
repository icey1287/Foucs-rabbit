//引入echarts库
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();  //引入小程序实例，以获取全局变量

// 初始化周学习时间统计折线图
function initWeekChart(canvas, width, height, dpr, weekStudyTime) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  const nameTextStyle = {
    fontSize: 14, // 字体大小
    color: '#333' // 字体颜色
  };

  const option = {
    title: {
      text: '周学习时间统计',
      left: 'center',
      textStyle: {
        fontSize: 18,
        color: '#333'
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: function (params) {
        return `${params[0].seriesName}\n${params[0].name}: ${params[0].value}分钟`;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '10%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      name: '星期',
      nameTextStyle: nameTextStyle,
      nameLocation: 'middle',
      nameGap: 25,
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      name: '时间 (分钟)',
      nameTextStyle: nameTextStyle,
      nameLocation: 'middle',
      nameGap: 40,
      axisLabel: {
        formatter: '{value}',
        fontSize: 12,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      }
    },
    series: [{
      name: '学习时间',
      data: weekStudyTime, // 使用全局数据
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#3e8ef7'
      },
      areaStyle: {
        color: 'rgba(62, 142, 247, 0.3)'
      },
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      }
    }]
  };

  chart.setOption(option,true);
  return chart;
}

// 初始化月学习时间统计折线图
function initMonthChart(canvas, width, height, dpr, monthStudyTime) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  const nameTextStyle = {
    fontSize: 14,
    color: '#333'
  };

  const option = {
    title: {
      text: '月学习时间统计',
      left: 'center',
      textStyle: {
        fontSize: 18,
        color: '#333'
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: function (params) {
        return `${params[0].seriesName}\n${params[0].name}: ${params[0].value}分钟`;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '10%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      name: '月份',
      nameTextStyle: nameTextStyle,
      nameLocation: 'middle',
      nameGap: 25,
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      },
      axisLabel: {
        color: '#666',
        rotate: 45 // 设置标签旋转45度
      }
    },
    yAxis: {
      type: 'value',
      name: '时间 (分钟)',
      nameTextStyle: nameTextStyle,
      nameLocation: 'middle',
      nameGap: 40,
      axisLabel: {
        formatter: '{value}',
        fontSize: 12,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      }
    },
    series: [{
      name: '学习时间',
      data: monthStudyTime, // 使用全局数据
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#ff7f50'
      },
      areaStyle: {
        color: 'rgba(255, 127, 80, 0.3)'
      },
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      }
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  //数据
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
    studyCount_year: 0,     //当年学习次数
    weekStudyTime: [0, 0, 0, 0, 0, 0, 0],  // 初始化为7天的学习时间
    monthStudyTime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  //初始化为12个月的学习时间    
    weekState:'',           //折线图当周开始日期
    weekEnd:'',             //折线图当周结束日期
    _Year:'',               //折线图年份
    weekChart: {            // 用于绑定周折线图的配置
      lazyLoad: true        // 设置 lazyLoad 为 true
    },          
    monthChart: {
      lazyLoad: true       // 设置 lazyLoad 为 true
    },                     // 用于绑定周折线图的配置
    isLogin: true          //控制页面加载，若用户未登录不加载页面
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

// 前一周
subtractWeek() {
  const weekStart = new Date(this.data.weekStart);
  const weekEnd = new Date(this.data.weekEnd);
  
  weekStart.setDate(weekStart.getDate() - 7);
  weekEnd.setDate(weekEnd.getDate() - 7);
  
  this.setData({
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0]
  });

  this.getOpenIdAndQueryWeek(this.data.weekStart);

},

// 后一周
addWeek() {
  const weekStart = new Date(this.data.weekStart);
  const weekEnd = new Date(this.data.weekEnd);
  
  weekStart.setDate(weekStart.getDate() + 7);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  this.setData({
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0]
  });

  this.getOpenIdAndQueryWeek(this.data.weekStart);
},

// 折线图前一年
subtractYear_() {
  const _Year = this.data._Year;
  const newYear = parseInt(_Year) - 1; // 减去一年
  
  this.setData({
    _Year: newYear.toString(),
  });

  this._getOpenIdAndQueryMonth(this.data._Year);
},

// 折线图后一年
addYear_() {
  const _Year = this.data._Year;
  const newYear = parseInt(_Year) + 1; // 加一年
  
  this.setData({
    _Year: newYear.toString(),
  });

  this._getOpenIdAndQueryMonth(this.data._Year);
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

// 获取 OpenID 并查询某周内的学习记录
getOpenIdAndQueryWeek: function(startDate) {
  // 调用云函数获取 OpenID
  wx.cloud.callFunction({
    name: 'getopenid', // 云函数名称，用于获取 openid
    success: res => {
      const openId = res.result.openid; // 获取 openid
      this.queryStudyByWeek(openId, startDate); // 使用 openid 查询一周的学习记录
    },
    fail: err => {
      console.error('获取 openid 失败:', err);
    }
  });
},

// 获取 OpenID 并查询某年每月的学习记录
_getOpenIdAndQueryMonth: function(year) {
  // 调用云函数获取 OpenID
  wx.cloud.callFunction({
    name: 'getopenid', // 云函数名称，用于获取 openid
    success: res => {
      const openId = res.result.openid; // 获取 openid
      this._queryStudyByMonth(openId, year); // 使用 openid 查询该年的每月学习记录
    },
    fail: err => {
      console.error('获取 openid 失败:', err);
    }
  });
},

// 查询某一天的学习记录，支持分页获取所有数据
queryStudyByDate: function(openId, targetDate) {
  const db = wx.cloud.database();
  let totalFocusTimeInSeconds = 0; // 总学习时长
  let studyCount = 0; // 学习次数
  let limit = 20; // 每次查询的记录数
  let skip = 0; // 查询的偏移量

  // 获取目标日期的开始和结束时间戳
  const startOfDay = new Date(targetDate).setHours(0, 0, 0, 0); // 一天的开始时间
  const endOfDay = new Date(targetDate).setHours(23, 59, 59, 999); // 一天的结束时间

  // 定义一个递归函数来分页获取数据
  const fetchData = () => {
    db.collection('focus').where({
      openId: openId,
      date_stamp: db.command.gte(startOfDay).and(db.command.lte(endOfDay)) // 时间范围查询
    }).limit(limit).skip(skip).get({
      success: res => {
        if (res.data.length > 0) {
          // 累加学习时间
          res.data.forEach(record => {
            totalFocusTimeInSeconds += record.focusTime; // 默认数据库中 focusTime 单位为分钟
          });

          studyCount += res.data.length; // 累加学习次数
          skip += limit; // 更新偏移量以获取下一批数据

          // 继续递归调用以获取更多数据
          fetchData();
        } else {
          // 当数据返回为空时，表示查询完成
          console.log('Total Focus Time (Seconds):', totalFocusTimeInSeconds);
          console.log('Total Study Count:', studyCount);

          // 设置查询结果到页面数据
          this.setData({
            focusTime_day: totalFocusTimeInSeconds,  // 当天学习总时长
            studyCount_day: studyCount               // 当天学习次数
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        });
        console.error('查询失败:', err);
      }
    });
  };

  // 开始首次数据查询
  fetchData();
},

// 查询某一个月的学习记录，支持分页获取所有数据
queryStudyByMonth: function(openId, targetMonth) {
  const db = wx.cloud.database();
  let totalFocusTimeInSeconds = 0; // 总学习时长
  let studyCount = 0; // 学习次数
  let limit = 20; // 每次查询的记录数
  let skip = 0; // 查询的偏移量

  // 将 targetMonth 转换为对应的开始日期和结束日期
  const [year, month] = targetMonth.split('-'); // "YYYY-MM"

  // 获取该月的第一天和最后一天的时间戳
  const startOfMonth = new Date(year, month - 1, 1).getTime(); // 当月第一天的时间戳
  const endOfMonth = new Date(year, month, 1).getTime() - 1; // 下个月第一天的前一毫秒

  // 定义一个递归函数来分页获取数据
  const fetchData = () => {
    db.collection('focus').where({
      openId: openId,
      date_stamp: db.command.gte(startOfMonth).and(db.command.lte(endOfMonth)) // 时间戳范围查询
    }).limit(limit).skip(skip).get({
      success: res => {
        if (res.data.length > 0) {
          // 累加学习时间
          res.data.forEach(record => {
            totalFocusTimeInSeconds += record.focusTime; // 累加学习时长
          });

          studyCount += res.data.length; // 累加学习次数
          skip += limit; // 更新偏移量以获取下一批数据

          // 继续递归调用以获取更多数据
          fetchData();
        } else {
          // 当数据返回为空时，表示查询完成
          console.log('Total Focus Time (Seconds):', totalFocusTimeInSeconds);
          console.log('Total Study Count:', studyCount);

          // 设置查询结果到页面数据
          this.setData({
            focusTime_month: totalFocusTimeInSeconds,  // 月学习总时长
            studyCount_month: studyCount               // 月学习次数
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        });
        console.error('查询失败:', err);
      }
    });
  };

  // 开始首次数据查询
  fetchData();
},

// 查询某一年的学习记录，支持分页获取所有数据
queryStudyByYear: function(openId, targetYear) {
  const db = wx.cloud.database();
  let totalFocusTimeInSeconds = 0; // 总学习时长
  let studyCount = 0; // 学习次数
  let limit = 20; // 每次查询的记录数
  let skip = 0; // 查询的偏移量

  // 获取该年第一天和最后一天的时间戳
  const startOfYear = new Date(targetYear, 0, 1).getTime(); // 当年第一天的时间戳
  const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999).getTime(); // 当年最后一天的时间戳

  // 定义一个递归函数来分页获取数据
  const fetchData = () => {
    db.collection('focus').where({
      openId: openId,
      date_stamp: db.command.gte(startOfYear).and(db.command.lte(endOfYear)) // 时间戳范围查询
    }).limit(limit).skip(skip).get({
      success: res => {
        if (res.data.length > 0) {
          // 累加学习时间
          res.data.forEach(record => {
            totalFocusTimeInSeconds += record.focusTime; // 累加学习时长
          });

          studyCount += res.data.length; // 累加学习次数
          skip += limit; // 更新偏移量以获取下一批数据

          // 继续递归调用以获取更多数据
          fetchData();
        } else {
          // 当数据返回为空时，表示查询完成
          console.log('Total Focus Time (Seconds):', totalFocusTimeInSeconds);
          console.log('Total Study Count:', studyCount);

          // 设置查询结果到页面数据
          this.setData({
            focusTime_year: totalFocusTimeInSeconds,  // 总学习时长
            studyCount_year: studyCount               // 总学习次数
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        });
        console.error('查询失败:', err);
      }
    });
  };

  // 开始首次数据查询
  fetchData();
},

// 查询所有的学习记录，支持分页获取所有数据
queryAllStudy: function(openId) {
  const db = wx.cloud.database();
  let totalFocusTimeInSeconds = 0; // 总学习时间
  let studyCount = 0; // 学习次数
  let studyDays = new Set(); // 用于存储学习的日期
  let limit = 20; // 每次查询的记录数
  let skip = 0; // 查询的偏移量

  // 定义一个递归函数，用于分页获取数据
  const fetchData = () => {
    db.collection('focus').where({
      openId: openId
    }).limit(limit).skip(skip).get({
      success: res => {
        if (res.data.length > 0) {
          // 累加学习时间并记录学习日期
          res.data.forEach(record => {
            totalFocusTimeInSeconds += record.focusTime; // 累加学习时长
            const date = new Date(record.date_stamp).toISOString().split('T')[0]; // 提取日期部分
            studyDays.add(date); // 添加到日期集合（去重）
          });

          studyCount += res.data.length; // 累加学习次数
          skip += limit; // 更新偏移量以获取下一批数据

          // 继续递归调用以获取更多数据
          fetchData();
        } else {
          // 当数据返回为空时，表示查询完成
          const uniqueStudyDays = studyDays.size; // 不同学习天数
          const averageFocusTime = studyCount > 0 ? parseFloat((totalFocusTimeInSeconds / uniqueStudyDays).toFixed(1)) : 0; // 计算日均时长

          // 设置查询结果到页面数据
          this.setData({
            totalFocusTime: totalFocusTimeInSeconds,  // 总学习时长
            totalStudyCount: studyCount,              // 总学习次数
            averageFocusTime: averageFocusTime        // 日均学习时长
          });

          console.log('Total Focus Time:', totalFocusTimeInSeconds);
          console.log('Total Study Count:', studyCount);
          console.log('Unique Study Days:', uniqueStudyDays);
          console.log('Average Focus Time per Day:', averageFocusTime);
        }
      },
      fail: err => {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        });
        console.error('查询失败:', err);
      }
    });
  };

  // 开始首次数据查询
  fetchData();
},

// 查询某一周的学习记录，支持分页查询
queryStudyByWeek: function(openId, startDate) {
  const db = wx.cloud.database();
  let weekStudyTime = new Array(7).fill(0); // 保存一周的学习时长，初始化为 0
  let limit = 20; // 每次查询的记录数

  // 定义一个递归函数进行分页查询
  const fetchData = (dayIndex, skip = 0) => {
    let targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + dayIndex);
    const startOfDay = new Date(targetDate).setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate).setHours(23, 59, 59, 999);

    db.collection('focus').where({
      openId: openId,
      date_stamp: db.command.gte(startOfDay).and(db.command.lte(endOfDay))
    }).limit(limit).skip(skip).get({
      success: res => {
        let totalFocusTimeInSeconds = 0;

        // 累加学习时间
        res.data.forEach(record => {
          totalFocusTimeInSeconds += record.focusTime; // 默认数据库中 focusTime 单位为分钟
        });

        weekStudyTime[dayIndex] += totalFocusTimeInSeconds; // 确保对应日期的学习时间累加

        if (res.data.length === limit) {
          // 如果返回的数据达到限制数量，则可能还有更多数据需要查询，继续分页查询
          fetchData(dayIndex, skip + limit);
        } else {
          // 如果没有更多数据，检查是否所有天数都处理完
          if (dayIndex < 6) {
            fetchData(dayIndex + 1); // 继续查询下一天
          } else {
            // 所有天数查询完毕，更新数据和初始化图表
            this.setData({
              weekStudyTime: weekStudyTime,
            });
            this.initWeek(); // 初始化图表
          }
        }
      },
      fail: err => {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        });
        console.error('查询失败:', err);
      }
    });
  };

  // 开始首次查询从第一天开始
  fetchData(0);
},

//查询某月的学习记录，支持分页查询
_queryStudyByMonth: function(openId, year) {
  const db = wx.cloud.database();
  let monthStudyTime = new Array(12).fill(0); // 保存每月的学习时长，初始化为 0
  let promises = []; // 存储所有查询的 Promise

  // 分页查询的递归函数
  const queryDataByMonth = (month, skip = 0, batchSize = 20) => {
    // 每个月的开始和结束时间
    const startOfMonth = new Date(year, month, 1).getTime();
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime(); // 这个月最后一天

    return new Promise((resolve, reject) => {
      db.collection('focus')
        .where({
          openId: openId,
          date_stamp: db.command.gte(startOfMonth).and(db.command.lte(endOfMonth)) // 时间范围查询
        })
        .skip(skip) // 跳过已经查询的记录
        .limit(batchSize) // 每次最多查询 20 条
        .get({
          success: res => {
            let totalFocusTimeInSeconds = 0;

            // 累加学习时间
            res.data.forEach(record => {
              totalFocusTimeInSeconds += record.focusTime; // 默认数据库中focusTime单位为分钟
            });

            // 更新该月份的学习时长
            monthStudyTime[month] += totalFocusTimeInSeconds;

            // 如果查询结果的数量等于 batchSize，继续分页查询
            if (res.data.length === batchSize) {
              queryDataByMonth(month, skip + batchSize).then(resolve).catch(reject); // 递归分页查询
            } else {
              resolve(); // 数据已经全部查询完成，结束递归
            }
          },
          fail: err => {
            wx.showToast({
              title: '查询失败',
              icon: 'none'
            });
            console.error('查询失败:', err);
            reject(err);
          }
        });
    });
  };

  // 创建每个月的 Promise，并进行分页查询
  for (let month = 0; month < 12; month++) {
    promises.push(queryDataByMonth(month)); // 每个月进行查询
  }

  // 等待所有 Promise 完成后再初始化图表
  Promise.all(promises).then(() => {
    this.setData({
      monthStudyTime: monthStudyTime, // 更新每月学习时间数据
    });
    
    this.initMonth(); // 初始化月份图表
  }).catch(err => {
    console.error('错误:', err);
  });
},

// 判断用户是否登录
judge: function() {
  this.setData({ isLogin: false }); 
  let openId = app.globalData.openId;
  if (openId === undefined || openId === null) {
    this.setData({ isLogin: false }); 
    // 用户未登录，显示模态框并跳转到登录页面
    wx.showModal({
      title: '提示',
      content: '请登录',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          // 跳转到登录页面，这里使用 navigateTo 或者 redirectTo
          wx.switchTab({
            url: '../me/index',
          })
        }
      }
    });
  }else{
    console.log("用户已登录");
    this.setData({ isLogin: true }); 
    this.ecWeekComponent = this.selectComponent('#weekChart');
    this.ecMonthComponent = this.selectComponent('#monthChart');
    this.initializeDate();
  }
},

// // 页面加载
// onLoad: function() {
//     this.initializeDate(); // 初始化日期和数据
// },


// 页面加载
onShow: function() {
  this.judge(); // 初始化日期和数据
},

// //获取当前页面组件
// onReady: function () {
//   this.ecWeekComponent = this.selectComponent('#weekChart');
//   this.ecMonthComponent = this.selectComponent('#monthChart');
// },

//周学习时间折线图渲染
initWeek: function () {
  const weekStudyTime = this.data.weekStudyTime;
  this.ecWeekComponent.init((canvas, width, height, dpr) => {
    return initWeekChart(canvas, width, height, dpr, weekStudyTime);
  });

},

//月学习时间折线图渲染
initMonth: function () {
  const monthStudyTime = this.data.monthStudyTime;
  this.ecMonthComponent.init((canvas, width, height, dpr) => {
    return initMonthChart(canvas, width, height, dpr, monthStudyTime);
  });
},

 // 初始化日期和数据的函数
 initializeDate: function() {
  const now = new Date(); // 获取当前日期

  // 计算当前周的开始日期（周一）和结束日期（周日）
  const dayOfWeek = now.getDay(); // 获取今天是星期几（0-6，0是周日，6是周六）
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 计算距离周一的天数
  const weekStartDate = new Date(now); // 创建新日期对象，避免直接修改 now
  weekStartDate.setDate(weekStartDate.getDate() - daysSinceMonday); // 设置为周一
  const weekEndDate = new Date(weekStartDate); // 创建周一的日期对象
  weekEndDate.setDate(weekEndDate.getDate() + 6); // 设置为周日

  this.setData({
    currentDate: now.toISOString().split('T')[0], // "YYYY-MM-DD"
    currentMonth: now.toISOString().split('T')[0].slice(0, 7), // "YYYY-MM"
    currentYear: now.getFullYear().toString(), // "YYYY"
    _Year: now.getFullYear().toString(), // "YYYY"
    weekStart: weekStartDate.toISOString().split('T')[0], // "YYYY-MM-DD"
    weekEnd: weekEndDate.toISOString().split('T')[0] // "YYYY-MM-DD"
  });
  this.getOpenIdAndQueryDate(this.data.currentDate); 
  this.getOpenIdAndQueryMonth(this.data.currentMonth); 
  this.getOpenIdAndQueryYear(this.data.currentYear); 
  this.getOpenIdAndQueryAllStudy();
  this.getOpenIdAndQueryWeek(this.data.weekStart);   //周折线图
  this._getOpenIdAndQueryMonth(this.data._Year);     //月折线图
},

// 下拉刷新页面恢复到当前日期的数据
onPullDownRefresh: function() {
  wx.stopPullDownRefresh(); // 停止下拉刷新
},

onShareAppMessage: function () {
  return {
    title: `我今天一共学习了 ${this.data.totalFocusTime} 分钟，快来一起学习吧！`,
    path: "",
    imageUrl: "/images/Sunday.png"  // 秩序之神：周日哥！
  }
},

});
