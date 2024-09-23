Page({
  data: {
    focus_target_time: 0, // 初始倒计时时间（分钟）
    minutes: '00',
    seconds: '00',
    timer: null
  },

  onLoad: function(options) {
    this.data.focus_target_time=options["focus_target_time"]
    this.data.minutes=this.data.focus_target_time
    this.startTimer();
    // const eventChannel = this.getOpenerEventChannel();
    // console.log(options)
    //  eventChannel.on('args', (res) => {
    //    console.log("Focusing:OnLoad:Args:",res.focus_target_time) 
    //    this.data.focus_target_time=res.focus_target_time;
    //    console.log(this.data)
    //    this.startTimer();
    //  })
  },

  startTimer: function() {
    let totalSeconds = this.data.focus_target_time * 60;
    
    this.data.timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(this.data.timer);
        wx.showModal({
          title: '提示',
          content: '倒计时结束！',
          showCancel: false
        });
        return;
      }

      totalSeconds--;
      this.setData({
        minutes: Math.floor(totalSeconds / 60).toString().padStart(2, '0'),
        seconds: (totalSeconds % 60).toString().padStart(2, '0')
      });
    }, 1000);
  },

  stopTimerButton: function() {
    wx.showModal({
      title: '提示',
      content: '确定要停止倒计时吗？',
      success: (res) => {
        if (res.confirm) {
          clearInterval(this.data.timer);
          wx.navigateBack();
        } else {
          this.startTimer();
        }
      }
    });
  }
});