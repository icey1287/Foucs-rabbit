// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext(); // 获取微信调用上下文

  return {
    openid: wxContext.OPENID, // 返回用户的 openid
  };
};
