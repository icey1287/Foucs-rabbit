const DoNotCallCloudFunc = false;
const app = getApp();
const fs = wx.getFileSystemManager()
let musicPlayer = null;
const bgPicCloudPath = app.globalData.bgPicCloudPath;
const bgMucCloudPath = app.globalData.bgMucCloudPath;
function getRandomInt(min, max) {
  const seed = Date.now();
  const rng = Math.sin(seed);
  return Math.floor(((rng + 1) / 2) * (max - min + 1)) + min;
}

const bgList = [
  "default_background_new_1.JPG",
  "default_background_new_2.JPG",
  "default_background_new_3.JPG",
  "default_background_new_4.JPG",
  "default_background_new_5.JPG",
  "default_background_new_6.JPG",
  "default_background_new_7.JPG",
];

const quoteList = [
  "学习新知识就像打怪升级，加油，你已经进步了一大步！",
  "别担心遇到困难，我一直陪着你呢！",
  "每一次专注学习，都是未来成功的垫脚石！",
  "学习路上，你的小伙伴随时为你加油打气！",
  "今天的任务很重要，但别忘了也要适时休息哦！",
  "你在努力，我看在眼里，继续加油吧！",
  "每个小进步，都会成为大成功的开始！",
  "学习虽然辛苦，但成果一定会让你骄傲！",
  "别怕犯错，错过才是最可怕的事情！",
  "休息片刻，再继续前进，保持你的学习节奏！",
  "只要你坚持，我就会一直陪着你，不离不弃！",
  "没有什么能难倒你，只要你愿意努力！",
  "每一天进步一点点，最终会有质的飞跃！",
  "只要你专注，学习变得轻而易举！",
  "放下杂念，享受学习的过程吧！",
  "今天又是努力学习的一天，继续保持吧！",
  "你越专注，学习越高效，我可是见证者哦！",
  "学习的路可能有些枯燥，但你不是一个人哦！",
  "每个学习的时刻，都会在未来的某一天给你回报！",
  "你有无限潜力，只要不断努力，总有一天会爆发！"
];
Page({
  data: {
    // 初始倒计时时间 Number
    init_min: 0,
    init_sec: 0,
    left_min: '00',
    left_sec: '00',
    timer: null,

    backgroundImage: null,
    defaultbg: "./image/default.png",


    musicName: [],
    musicPath: [],


    musicIndex: 0,

    keepScreenOn: false,
    paused: false,
    quote: null,

    petName: null,
    petImage:null,
  },
  startTimer: function () {
    if (this.data.timer != null) {
      console.error("focus:startTimer:", "多次初始化")
      return
    }
    let totalSeconds = Number(this.data.init_min * 60) + Number(this.data.init_sec);
    this.data.timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(this.data.timer);
        let addgold = this.data.init_min?this.data.init_min*100:this.data.init_sec*100;
        this.stopMusic();
        this.destroyMusic();
        wx.showModal({
          title: '提示',
          content: '倒计时结束！获得金币*' + addgold,
          // content: '倒计时结束！获得金币*500',
          showCancel: false,
          success: (res) => {
            if (!DoNotCallCloudFunc) {//TEST:测试用5sec <=> 5min
              if (this.data.init_min == 0) {
                this.addFocusRecord(this.data.init_sec);
                this.updateUserTotalTime(this.data.init_sec,addgold);
              } else {
                this.addFocusRecord(this.data.init_min);
                this.updateUserTotalTime(this.data.init_min,addgold);
              }
            }
            this.goBack();
          }
        });
      }
      else if (!this.data.paused) {
        totalSeconds--;
        this.setData({
          left_min: Math.floor(totalSeconds / 60).toString().padStart(2, '0'),
          left_sec: (totalSeconds % 60).toString().padStart(2, '0')
        });
        this.drawClock(this.data.left_min, this.data.left_sec);
      };
      if (Number(this.data.left_sec) % 30 == 0 || this.data.quote === null) {
        // console.log("focus:left_min:", Number(this.data.left_sec))
        let quote = quoteList[getRandomInt(0, quoteList.length - 1)];
        this.setData({ quote: this.data.petName ? this.data.petName + ":" + quote : quote })
      }
    }, 1000);
  },
  drawClock: function (min, sec) {
    min = Number(min)
    sec = Number(sec)
    // console.log("focus:drawClock:","min:",min,"sec:",sec)
    wx.createSelectorQuery()
      .select('#ClockCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const width = res[0].width
        const height = res[0].height

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        ctx.clearRect(0, 0, width, height)

        // 绘制红色正方形
        // ctx.fillStyle = 'rgb(200, 0, 0)';
        // ctx.fillRect(10, 10, 50, 50);

        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(width, height) / 2 - 10

        // 绘制背景圆
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.strokeStyle = '#cccccc'
        ctx.lineWidth = 5
        ctx.stroke()

        // 计算进度
        const progress = sec / 60

        // 绘制进度圆弧
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, (2 * Math.PI * progress) - Math.PI / 2)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 5
        ctx.stroke()

        // 绘制时间文本
        const minutes = min.toString().padStart(2, '0')
        const seconds = sec.toString().padStart(2, '0')
        const timeText = `${minutes}:${seconds}`

        ctx.fillStyle = '#ffffff'
        // ctx.font = 'bold 20px Arial'
        ctx.font = 'bold ' + width / 7 + 'px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(timeText, centerX, centerY)
      })
  },
  initMusic: function () {
    if (musicPlayer == null) {
      musicPlayer = wx.createInnerAudioContext()
      musicPlayer.src = this.data.musicPath[this.data.musicIndex]
    } else {
      console.error("focus:", "initMusic:多次初始化")
    }
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
  destroyMusic: function () {
    if (musicPlayer != null && musicPlayer != undefined) {
      musicPlayer.destroy();
      musicPlayer = null
    }
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
  updateUserTotalTime: function (addtime,addgold) {
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
            gold: _.inc(addgold),
          }
        })
    })
  },
  onSunTap: function () {
    const nextStatus = !this.data.keepScreenOn;
    wx.setKeepScreenOn({
      keepScreenOn: nextStatus,
      success: () => {
        this.setData({
          keepScreenOn: nextStatus
        })
        console.log("focus:onSunTap:", "切换常量:", nextStatus, "Ok");
        wx.showToast({
          title: (nextStatus ? '开启' : '关闭') + '屏幕常亮',
          icon: 'success',
          duration: 1500
        })
      },
      fail: () => {
        console.error("focus:onSunTap:", "切换常量:", nextStatus, " Failed")
      },
      complete: () => {
        console.log("focus:onSunTap:", "当前keepScreenOn:", this.data.keepScreenOn)
      }
    })
  },
  musicSwitchUI: function (e) {
    this.data.musicIndex = Number(e.detail.value)
    this.stopMusic();
    
    // musicPlayer = wx.createInnerAudioContext()
    musicPlayer.src=this.data.musicPath[this.data.musicIndex]
    musicPlayer.seek(0)
    if(!this.data.paused){
      this.startMusic();
    }
  },
  onPauseTap: function () {
    // musicPlayer = wx.createInnerAudioContext()
    if (this.data.paused) {
      musicPlayer.play()
    } else {
      musicPlayer.pause()
    }
    this.data.paused=!this.data.paused;
    let tmp = this.data.paused;
    this.setData({paused:tmp})
    console.log("focus:musicplayer.paused:",musicPlayer.paused);
    console.log("focus:", "this.data.paused:", this.data.paused)
    // this.data.timer会读取paused变量暂停
  },
  onStopTap: function () {
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

  /***********************************************************************/
  onLoad: function (options) {
    let musicname = [];
    let musicpath = [];
    Object.keys(bgMucCloudPath).forEach(key => {
      let path = this.getFilePath(key);
      if (path != null && path != undefined) {
        musicname.push(bgMucCloudPath[key].name)
        musicpath.push(this.getFilePath(key))
      }
    })
    this.setData({
      musicName: musicname,
      musicPath: musicpath
    })
    let validbgPicPath=[]
    Object.keys(bgPicCloudPath).forEach(key => {
      let path = this.getFilePath(key);
      if (path != null && path != undefined) {
        validbgPicPath.push(path)
      }
    })
    // this.setData({petImage:"/images/icons/copy.png"});
    this.setData({ backgroundImage:validbgPicPath[getRandomInt(0,validbgPicPath.length-1)]})
    // this.setData({ backgroundImage: "./image/" + bgList[Date.now() % bgList.length] })
    this.setData({
      left_min: options["min"],
      init_min: Number(options["min"]),
      left_sec: options["sec"],
      init_sec: Number(options["sec"]),
      petName: options["petName"] || null,
      petImage:options["petImage"]||null
    })
    this.initMusic();
    this.startMusic();
    this.startTimer();
  },
  onUnload: function () {
    console.log("focus:Unload")
    this.stopMusic();
    this.destroyMusic();
  },
  onHide() {
    console.log("focus:Hide")
    if (musicPlayer != null && musicPlayer != undefined && musicPlayer.paused == false) {
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
    if (musicPlayer.paused == true) {
      musicPlayer.play();
    } else {
      console.log("focus:", "onShow but not paused?")
      this.startMusic()
    }
  },
  getFilePath(key) {
    let cache = wx.getStorageSync(key);
    if (cache != null && cache != undefined) {
      try {
        fs.accessSync(cache);
        return cache;
      } catch (e) {
        console.log('focus:getFilePath:读取本地缓存文件:' + cache + '失败', e);
      }
    }
    return null;
  }
}
);
