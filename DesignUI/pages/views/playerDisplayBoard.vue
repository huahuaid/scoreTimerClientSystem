<template>
  <view class="referee-practice">
    <!-- 标题栏 -->
    <view class="title-banner">
      <button class="back-btn" @click="goBack">
        <image src="/static/image/Head.png" mode="aspectFit" class="back-icon"></image>
      </button>
      <text class="title-text">超雄汇裁判员练习</text>
      <button class="menu-button" @click="toggleMenu">☰</button>
      <view class="menu-bar" v-show="showMenu">
        <view class="menu-item" v-for="item in menuItems" :key="item" @click="handleMenuItemClick(item)">
          {{ item }}
        </view>
      </view>
    </view>

    <view class="content-container">
      <!-- 状态标签 -->
      <view class="status-section">
        <view class="status-item" :class="{ active: activeTab === 'ongoing' }" @click="activeTab = 'ongoing'">
          <text class="status-title">进行中</text>
          <text class="status-count">({{ ongoingMatches.length }})</text>
        </view>
        <view class="status-item" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">
          <text class="status-title">已完成</text>
          <text class="status-count">({{ completedMatches.length }})</text>
        </view>
      </view>

      <!-- 比赛列表 -->
      <view class="match-list">
        <view class="match-item" v-for="(match, index) in displayedMatches" :key="match.id">
          <view class="match-header">
            <text class="venue">{{ match.venue }}</text>
            <text class="match-info">{{ match.description }}</text>
          </view>

          <view class="players-section">
            <view class="player-container">
              <view class="player-info">
                <image :src="headImage" class="player-avatar" mode="aspectFill"></image>
                <text class="player-name">{{ formatPlayerName(match.players[0]) }}</text>
                <text v-if="match.players[2]" class="player-name">{{ formatPlayerName(match.players[2]) }}</text>
              </view>
              <view v-if="match.scores" class="score-display">
                <text>{{ match.scores.player1.game1 }} - {{ match.scores.player2.game1 }}</text>
                <text>{{ match.scores.player1.game2 }} - {{ match.scores.player2.game2 }}</text>
                <text>{{ match.scores.player1.game3 }} - {{ match.scores.player2.game3 }}</text>
              </view>
            </view>

            <text class="vs">VS</text>

            <view class="player-container">
              <view class="player-info">
                <image :src="headImage" class="player-avatar" mode="aspectFill"></image>
                <text class="player-name">{{ formatPlayerName(match.players[1]) }}</text>
                <text v-if="match.players[3]" class="player-name">{{ formatPlayerName(match.players[3]) }}</text>
              </view>
            </view>
          </view>

          <view class="action-buttons">
            <button class="score-btn" type="primary" @click="handleScoreClick(match)">
              {{ match.status === 'completed' ? '重新签名' : '记分' }}
            </button>
          </view>

          <view class="divider" v-if="index < displayedMatches.length - 1"></view>
        </view>

        <view v-if="displayedMatches.length === 0" class="no-matches">
          暂无比赛数据
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

// 静态资源路径
const headImage = '/static/image/Head.png';

// 状态管理
const activeTab = ref('ongoing');
const menuItems = ref(['签到', '直播', '录制视频']);
const showMenu = ref(false);

// 比赛数据
const matches = ref([
  {
    id: 1,
    venue: '场地1',
    description: '第1场 一局单打21分 D组 [练CS010]',
    players: ['张永祺', '孙卫平', 'hang', 'gala'],
    status: 'ongoing',
    scores: null
  },
  {
    id: 2,
    venue: '场地2',
    description: '第2场 一局单打21分 D组 [练CS058]',
    players: ['张永祺', '王梁荣'],
    status: 'ongoing',
    scores: null
  },
]);

// 计算属性
const ongoingMatches = computed(() => {
  return matches.value.filter(match => match.status === 'ongoing');
});

const completedMatches = computed(() => {
  return matches.value.filter(match => match.status === 'completed');
});

const displayedMatches = computed(() => {
  return activeTab.value === 'ongoing' ? ongoingMatches.value : completedMatches.value;
});

// 格式化选手名称
const formatPlayerName = (name) => {
  if (name.includes('/')) {
    return name.split('/').join(' / ');
  }
  return name;
};

// 方法
const goBack = () => {
  uni.navigateBack();
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const handleMenuItemClick = (item) => {
  console.log(`选择了菜单项: ${item}`);
  showMenu.value = false;
  
  // 根据菜单项跳转不同页面
  switch(item) {
    case '签到':
      uni.navigateTo({ url: '/pages/signin/signin' });
      break;
    case '直播':
      uni.navigateTo({ url: '/pages/live/live' });
      break;
    case '录制视频':
      uni.navigateTo({ url: '/pages/record/record' });
      break;
  }
};

const handleScoreClick = (match) => {
	console.log("HUAHUA")
  const query = {
    venue: match.venue,
    description: match.description,
    player1: match.players[0],
    player2: match.players[1],
    avatar: headImage,
    // 添加更多需要传递的参数
    matchId: match.id,
    gameType: match.type
  };

  // 处理双打选手
  if (match.players[2]) query.player3 = match.players[2];
  if (match.players[3]) query.player4 = match.players[3];

  // 构建查询字符串
  const queryString = Object.keys(query)
    .map(key => `${key}=${encodeURIComponent(query[key])}`)
    .join('&');

  uni.navigateTo({
    url: `/pages/views/ScoreTimer?${queryString}`
  });
};
</script>

<style>
@import url("../../css/pages/views/playerDisplayBoard.css");
</style>