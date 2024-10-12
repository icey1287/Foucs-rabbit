// tab.js
Component({
  properties: {
    tabList: {
      type: Array,
      value: []
    }
  },

  data: {
    currentTab: 0
  },

  methods: {
    handleTabTap(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ currentTab: index });
      this.triggerEvent('gettab', { index, value: this.data.tabList[index] });
    }
  }
})