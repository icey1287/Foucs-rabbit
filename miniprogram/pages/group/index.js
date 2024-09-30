Page({
  data: {
    showGroupInfo: false,  // 控制查看小组信息弹窗的显示
    showCreateGroupModal: false, // 控制创建小组弹窗的显示
    groupName: '',  // 保存小组名输入
    groupId: '',    // 保存小组ID输入
    members: [
      { id: 1, name: 'Alice', focusTime: 120 },
      { id: 2, name: 'Bob', focusTime: 90 }
      // 其他成员信息
    ]
  },

  // 弹出我的小组信息
  showMyGroup() {
    wx.showModal({
      title: '我的小组',
      content: '这是你的小组信息',
      showCancel: false
    });
  },

  // 显示创建小组弹窗
  showCreateGroup() {
    this.setData({
      showCreateGroupModal: true
    });
  },

  // 弹出加入小组提示
  showJoinGroup() {
    wx.showModal({
      title: '加入小组',
      content: '加入小组成功！',
      showCancel: false
    });
  },

  // 显示查看小组信息的弹窗
  showViewGroupInfo() {
    this.setData({
      showGroupInfo: true
    });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showGroupInfo: false,
      showCreateGroupModal: false
    });
  },

  // 保存小组名输入
  onGroupNameInput(e) {
    this.setData({
      groupName: e.detail.value
    });
  },

  // 保存小组ID输入
  onGroupIdInput(e) {
    this.setData({
      groupId: e.detail.value
    });
  },

  // 提交创建小组
  submitGroupCreation() {
    const { groupName, groupId } = this.data;
    if (!groupName || !groupId) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 这里你可以加入创建小组的逻辑，例如发送请求到服务器
    wx.showToast({
      title: '创建小组成功',
      icon: 'success'
    });

    // 关闭弹窗并清空输入
    this.setData({
      showCreateGroupModal: false,
      groupName: '',
      groupId: ''
    });
  }
});
