const DoNotCallCloudFunc = false;
Page({
  data: {
    init_min: 0, // 初始倒计时时间（分钟）
    init_sec: 0, // 初始倒计时时间（分钟）
    left_min: '00',
    left_sec: '00',
    timer: null,

    backgroundImage: 'http://hbimg.huaban.com/e92af58a83fa3803116302760183d4f916a17be72db3eb-qIXn3T',
    backgroundAudio: '/audios/Aria.mp3'

  },
  startTimer: function () {
    let totalSeconds = Number(this.data.init_min * 60) + Number(this.data.init_sec);
    this.data.timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(this.data.timer);
        wx.showModal({
          title: '提示',
          content: '倒计时结束！获得宠物?',//TODO
          showCancel: false,
          success: (res) => {
            if (!DoNotCallCloudFunc) {//TEST:测试用5sec <=> 5min
              if (this.data.init_min == 0) {
                this.upsertFocus(this.data.init_sec);
                this.updateUserTotalTime(this.data.init_sec)
              } else {
                this.upsertFocus(this.data.init_min);
                this.updateUserTotalTime(this.data.init_min)
              }
            }
            this.goBack();
          }
        });
        return;
      }
      totalSeconds--;
      this.setData({
        left_min: Math.floor(totalSeconds / 60).toString().padStart(2, '0'),
        left_sec: (totalSeconds % 60).toString().padStart(2, '0')
      });
    }, 1000);
  },

  //插入focus一条专注记录
  upsertFocus: function (addtime) {
    const dbname = 'focus';
    const db = wx.cloud.database();
    const _ = db.command
    addtime = Number(addtime)
    db.collection(dbname).add({
      data:
      {
        focusTime: addtime,
        date: (new Date()).toDateString(),
        date_stamp:Date.now()
      }

    })
  },
  //更新users表的sumFocusTime和gold
  //(更新总专注时长,金币)
  updateUserTotalTime: function (addtime) {
    addtime = Number(addtime)
    const dbname = 'users';
    const db = wx.cloud.database();
    const _ = db.command
    db.collection(dbname).get().then(res => {
      if (res.data.length === 0) {
        console.log("focus:err:", "我没在focus表?请登录以创建focus表")
        return;
      }
      const user = res.data[0]
      db.collection(dbname).doc(user._id)
        .update({
          data: {
            sumFocusTime: _.inc(addtime),
            gold: _.inc(addtime),
          }
        })
    })
  },
  stopTimerButton: function () {
    wx.showModal({
      title: '提示',
      content: '确定要停止倒计时吗？',
      success: (res) => {
        if (res.confirm) {
          this.goBack();
        } else {
          return;
          // this.startTimer();
        }
      }
    });
  },
  goBack: function () {
    clearInterval(this.data.timer);
    // wx.navigateBack();
    wx.reLaunch({
      url: '../home/index',
    })
  },
  /***********************************************************************/
  onLoad: function (options) {
    this.data.init_min = this.data.left_min = options["min"]
    console.log("this.data.init_min:", this.data.init_min, "this.data.left_min:", this.data.left_min)
    this.data.init_sec = this.data.left_sec = options["sec"]


    // 继续播放音频的代码
    const fs = wx.getFileSystemManager()
    fs.access({
      path: this.data.backgroundAudio,
      success: () => {
        console.log('音频文件存在')
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = this.data.backgroundAudio
        innerAudioContext.onError((err) => {
          console.error('音频播放失败', err)
        })
        innerAudioContext.play()
      },
      fail: (err) => {
        console.error('音频文件不存在', err)
      }
    })



    // this.data.minutes = this.data.init_min
    this.startTimer();
    // const eventChannel = this.getOpenerEventChannel();
    // console.log(options)
    //  eventChannel.on('args', (res) => {
    //    console.log("Focusing:OnLoad:Args:",res.init_min) 
    //    this.data.init_min=res.init_min;
    //    console.log(this.data)
    //    this.startTimer();
    //  })
  },
  onUnload: function () {
    if (this.backgroundAudioManager) {
      this.backgroundAudioManager.stop();
    }
  },
  onHide() {
    // console.log("HIDE")
  },
  onShow() {
    wx.hideHomeButton({
      success: function () {
        console.log("focusing:", "hide homebutton success")
      },
      fail: function () {
        console.log("focusing:", "hide homebutton success")
      }
    });
  }
}
);
