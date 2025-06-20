<template>
  <view class="container">
    <!-- 动态生成按钮 -->
    <view v-for="(item, index) in navData" :key="index" class="button-wrapper">
      <button class="nav-button" @click="navigateTo(item.path)">
        {{ item.name || `页面${index + 1}` }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 导航数据，根据你的pages.json自动生成
const navData = ref([
  { name: "首页", path: "/css/pages/index/index" },
  { name: "分数计时器", path: "/pages/views/ScoreTimer" },
  { name: "玩家展示板", path: "/pages/views/playerDisplayBoard" },
]);

// 统一跳转方法
const navigateTo = (path: string) => {
  if (!path) {
    uni.showToast({
      title: '该页面路径未配置',
      icon: 'none'
    });
    return;
  }
  
  // 判断是否是tabBar页面（根据你的实际情况调整）
  const isTabBarPage = false; // 如果你的页面中有tabBar页面，需要特殊处理
  
  if (isTabBarPage) {
    uni.switchTab({
      url: path,
      fail: () => {
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  } else {
    uni.navigateTo({
      url: path,
      fail: () => {
        uni.showToast({
          title: '页面不存在或路径错误',
          icon: 'none'
        });
      }
    });
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.button-wrapper {
  width: 100%;
}

.nav-button {
  width: 100%;
  padding: 12px 0;
  background-color: #007AFF;
  color: white;
  border-radius: 8px;
  border: none;
  font-size: 16px;
}

/* 可以根据需要添加更多样式 */
</style>