// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        //env: 'wx-env01-3gf49vue58112f1',
        env: 'jgzt-6guvlk751444cb8d',
        traceUser: true,
      });
    }

    this.globalData = {
      bgPicCloudPath: {
        "bg_pic_1": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/image/default_background_new_1.jpg" },
        "bg_pic_2": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/image/default_background_new_2.jpg" },
        "bg_pic_3": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/image/default_background_new_3.jpg" },
        "bg_pic_4": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/image/default_background_new_4.jpg" },
        "bg_pic_5": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/image/default_background_new_5.jpg" },
        "bg_pic_6": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/image/default_background_new_6.jpg" },
        "bg_pic_7": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/image/default_background_new_7.jpg" },
      },
      bgMucCloudPath: {
        "bg_music_1": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/audios/bonfire.mp3", "name": "燃火" },
        "bg_music_2": { "url": "cloud://jgzt-6guvlk751444cb8d.6a67-jgzt-6guvlk751444cb8d-1329375150/audios/rain.mp3", "name": "雨声" },
      }
    };
    // const openId = wx.getStorageSync('openId');
    // this.globalData.openId=openId;
  }
});
