<template>
	<view class="game-start-wrapper" :class="{ 'visible': isVisible }">
		<view class="GameStartComponent" v-if="isVisible">
			<game-start-component @cancel="onCancel" @confirm="onConfirm" />
		</view>

		<div class="ball" draggable="true" @dragstart="onBallDragStart" @drag="onBallDrag" @dragend="onBallDragEnd"
			:style="{ left: ballPosition.x + 'px', top: ballPosition.y + 'px' }">
		</div>

		<view class="left-add-score">
			<button class="add-btn" @click="incrementLeft">+</button>
		</view>

		<view class="right-add-score">
			<button class="add-btn" @click="incrementRight">+</button>
		</view>

		<view class="page-wrapper">
			<view class="container">
				<view class="bar">
					<view class="back-button">
						<button>返回</button>
					</view>
					<view class="title">huahua</view>
				</view>

				<view class="content-wrapper">
					<view class="header">
						<text class="title">一局单打21分 D组[练CS010]</text>
					</view>

					<view class="CompetitionScore">
						<view class="big-score">{{ bigLeft }} : {{ bigRight }}</view>
						<view class="small-score">
							{{ smallLeft.toString().padStart(2, '0') }} : {{ smallRight.toString().padStart(2, '0') }}
						</view>
					</view>

					<view class="content">
						<!-- 左侧分区 -->
						<view class="player-info-left">
							<view v-for="(player, index) in leftPlayers" :key="player.id" draggable="true"
								@dragstart="onDragStart(index, 'left')" @dragover.prevent @drop="onDrop(index, 'left')"
								class="player" :style="{ opacity: player.exists ? 1 : 0 }">
								<image :id="`left-avatar-${player.id}`" src="@/static/image/One.png" mode="aspectFill"
									class="player-avatar"></image>
								<text class="player-name">{{ player.name }}</text>
							</view>
						</view>

						<view class="player-info-right">
							<view v-for="(player, index) in rightPlayers" :key="player.id" draggable="true"
								@dragstart="onDragStart(index, 'right')" @dragover.prevent
								@drop="onDrop(index, 'right')" class="player"
								:style="{ opacity: player.exists ? 1 : 0 }">
								<image :id="`right-avatar-${player.id}`" src="@/static/image/One.png" mode="aspectFill"
									class="player-avatar"></image>
								<text class="player-name">{{ player.name }}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="Timer">
					{{ formattedTime }}
				</view>

				<view class="actions">
					<button @click="swapAllPlayers">双方换边</button>
					<button @click="swapId2AndId3">单打交换</button>
					<button @click="startMatch">开始比赛</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import GameStartComponent from "@/compents/GameStartComponent.vue"
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	
	interface MatchParams {
	  venue: string
	  description: string
	  player1: string
	  player2: string
	  player3?: string
	  player4?: string
	  avatar: string
	  matchId: string
	  gameType: string
	}
	
	const description = ref('')
	const players = ref<string[]>([])
	const avatar = ref('')
	const matchId = ref('')
	const gameType = ref('')
	
	onLoad((options: Partial<MatchParams>) => {
	  // 初始化或重置状态
	  stopTimer(); // 假设这是停止计时器的函数
	  
	  // 解析参数并设置基本值
	  venue.value = options.venue || '';
	  description.value = options.description || '';
	  avatar.value = options.avatar || '';
	  matchId.value = options.matchId || '';
	  gameType.value = options.gameType || '';
	  
	  // 处理选手数据
	  players.value = [
	    options.player1 || '',
	    options.player2 || '',
	    options.player3 || '',
	    options.player4 || ''
	  ].filter(p => p);
	  
	  // 判断是否为双打比赛
	  const hasPlayer4 = 'player4' in options && options.player4;
	  if (hasPlayer4) {
	    isDoubleGame.value = true;
	    DoubleInitialPlayers(); // 初始化双打比赛设置
	  } else {
	    countLeft.value = 1;    // 重置左侧计数
	    countRight.value = 1;   // 重置右侧计数
	    isDoubleGame.value = false;
	    SingleInitialPlayers(); // 初始化单打比赛设置
	  }
	  
	  // 调试日志
	  console.log('接收到的比赛数据:', {
	    venue: venue.value,
	    description: description.value,
	    players: players.value,
	    avatar: avatar.value,
	    matchId: matchId.value,
	    gameType: gameType.value,
	    isDoubleGame: isDoubleGame.value
	  });
	});
	
	import {
		onBallDragEnd,
		onBallDrag,
		onBallDragStart,
		countLeft,
		countRight,
		venue,
		stopTimer,
		DoubleInitialPlayers,
		SingleInitialPlayers,
		isDoubleGame,
		resetGame,
		dialogPopup,
		gameOverVisible,
		currentGame,
		dialogVisible,
		startTimer,
		formattedTime,
		leftPlayers,
		rightPlayers,
		ballPosition,
		bigLeft,
		bigRight,
		smallLeft,
		smallRight,
		isVisible,
		incrementLeft,
		incrementRight,
		swapAllPlayers,
		swapId2AndId3,
		swapLeftPositions,
		swapRightPositions,
		startMatch,
		onDragStart,
		onDrop,
		onCancel,
		onConfirm,
	} from "../../script/moveAthlete"
</script>

<style scoped>
	@import url("@/css/pages/views/ScoreTimer.css");
</style>