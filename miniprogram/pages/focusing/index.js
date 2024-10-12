
const DoNotCallCloudFunc = false;
const fs = wx.getFileSystemManager()

let musicPlayer = null;

Page({
  data: {
    // 初始倒计时时间 Number
    init_min: 0,
    init_sec: 0,

    left_min: '00',
    left_sec: '00',
    timer: null,

    backgroundImage: 'https://kkimgs.yisou.com/ims?kt=url&at=smstruct&key=aHR0cHM6Ly9pbWcuemNvb2wuY24vY29tbXVuaXR5LzAxYmU4ZjU4Nzc1YTg5YTgwMTIwNjBjOGJiMzYzZi5qcGdAMTI4MHdfMWxfMm9fMTAwc2guanBn&sign=yx:j7giMzRmoBbqFMRou1Is4bvbT8A=&tv=400_400',

    musicName: ["英语", "英语2"],
    musicPath: ["/audios/Aria.mp3", "/audios/Guy.mp3"],

    musicIndex: 0,
  },
  startTimer: function () {
    let totalSeconds = Number(this.data.init_min * 60) + Number(this.data.init_sec);
    this.data.timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(this.data.timer);
        this.stopMusic();
        wx.showModal({
          title: '提示',
          content: '倒计时结束！获得宠物?',//TODO
          showCancel: false,
          success: (res) => {
            if (!DoNotCallCloudFunc) {//TEST:测试用5sec <=> 5min
              if (this.data.init_min == 0) {
                this.addFocusRecord(this.data.init_sec);
                this.updateUserTotalTime(this.data.init_sec)
              } else {
                this.addFocusRecord(this.data.init_min);
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
  initMusic: function () {
    musicPlayer = wx.createInnerAudioContext()
    musicPlayer.src = this.data.musicPath[this.data.musicIndex]
  },
  stopMusic: function () {
    if (musicPlayer) {
      musicPlayer.stop();
    }
  },
  //切换到musicPath[index]
  startMusic: function () {
    const audioPath = this.data.musicPath[this.data.musicIndex]
    fs.access({
      path: audioPath,
      success: () => {
        musicPlayer.src = audioPath;
        console.log('focus:音频文件存在', audioPath)
        musicPlayer.onError((err) => {
          console.error('音频播放失败', err)
        })
        musicPlayer.onEnded(function (_) {//循环播放
          musicPlayer.seek(0)
          musicPlayer.play()
        })
        console.log("focus:Playing:", audioPath)
        musicPlayer.play()
      },
      fail: (err) => {
        console.error('focus:音频文件不存在', err)
      }
    })
  },
  restartMusic: function () {
    this.stopMusic();
    this.startMusic();
  },
  //插入focus一条专注记录
  addFocusRecord: function (addtime) {
    const dbname = 'focus';
    const db = wx.cloud.database();
    const _ = db.command
    addtime = Number(addtime)
    db.collection(dbname).add({
      data:
      {
        focusTime: addtime,
        date: (new Date()).toDateString(),
        date_stamp: Date.now()
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
  stopTimerUI: function () {
    wx.showModal({
      title: '提示',
      content: '确定要停止倒计时吗？',
      success: (res) => {
        if (res.confirm) {
          this.stopMusic();
          clearInterval(this.data.timer);
          this.goBack();
        } else {
          return;
          // this.startTimer();
        }
      }
    });
  },
  //
  goBack: function () {
    // console.log("focus:goBack")
    clearInterval(this.data.timer);
    this.stopMusic();
    // wx.navigateBack();
    wx.reLaunch({
      url: '../home/index',
      fail: function () {
        console.log("focus:", "跳转至主页失败")
      }
    })
  },

  musicSwitchUI: function (e) {
    this.data.musicIndex = Number(e.detail.value)
    this.restartMusic();
  },
  /***********************************************************************/
  onLoad: function (options) {
    this.data.left_min = options["min"]
    this.data.init_min = Number(options["min"])
    this.data.left_sec = options["sec"]
    this.data.init_sec = Number(options["sec"])
    this.initMusic();
    this.startMusic();
    this.startTimer();
  },
  onUnload: function () {
    console.log("focus:Unload")
    this.stopMusic();
  },



  onHide() {
    console.log("focus:Hide")
    if(musicPlayer.paused==false){
      musicPlayer.pause()
    }
  },
  onShow() {
    wx.hideHomeButton({
      success: function () {
        console.log("focus:", "hide homebutton success")
      },
      fail: function () {
        console.log("focus:", "hide homebutton success")
      }
    });
    if(musicPlayer.paused==true){
      musicPlayer.play();
    }else{
      console.log("focus:","onShow but not paused?")
      this.startMusic()
    }
  }
}
);
