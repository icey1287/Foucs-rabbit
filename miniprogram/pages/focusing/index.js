Page({
  data: {
    init_min: 0, // 初始倒计时时间（分钟）
    init_sec: 0, // 初始倒计时时间（分钟）
    left_min: '00',
    left_sec: '00',
    timer: null
  },

  onLoad: function (options) {
    this.data.init_min = this.data.left_min = options["min"]
    console.log("this.data.init_min:",this.data.init_min,"this.data.left_min:",this.data.left_min)
    this.data.init_sec = this.data.left_sec = options["sec"]
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

  startTimer: function () {
    let totalSeconds = Number(this.data.init_min * 60) + Number(this.data.init_sec);
    this.data.timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(this.data.timer);
        wx.showModal({
          title: '提示',
          content: '倒计时结束！',
          showCancel: false,
          success: (res) => {
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
    wx.navigateBack();
  }
}
);