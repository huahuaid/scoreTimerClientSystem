<template>
  <div class="match-confirmation">
    <!-- 顶部比赛信息 -->
    <div class="match-header">
      <div class="match-info">
        <span class="venue">场地{{ currentMatch.venue }}</span>
        <span class="match-number">第{{ currentGame }}场</span>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="players-display">
        <div class="player">
          <div class="name">{{ currentMatch.players[0] }}</div>
          <div class="score">00</div>
          <div class="rounds-won">已胜回合: {{ currentMatch.roundsWon[0] }}</div>
        </div>
        <div class="vs">VS</div>
        <div class="player">
          <div class="name">{{ currentMatch.players[1] }}</div>
          <div class="score">00</div>
          <div class="rounds-won">已胜回合: {{ currentMatch.roundsWon[1] }}</div>
        </div>
      </div>
    </div>
    <!-- 中间确认文字 -->
    <div class="confirmation-text">
      确认开始第1局比赛吗？
    </div>

    <!-- 底部操作按钮 -->
    <div class="button-group">
      <button @click="handleCancel" class="cancel-btn">取消</button>
      <button @click="handleConfirm" class="confirm-btn">确认</button>
    </div>
  </div>
</template>

<script setup>
import {
  currentGame
} from '../script/moveAthlete.ts'
import { ref, defineEmits } from 'vue';

// 定义组件可以触发的事件
const emit = defineEmits(['cancel', 'confirm', 'close']);

const currentMatch = ref({
  venue: '10',
  players: ['张永棋', '张端端'],
  roundsWon: [0, 0]
});

const handleClose = () => {
  emit('close');
};

const handleCancel = () => {
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm');
};
</script>

<style>
	.match-confirmation {
	  display: flex;
	  flex-direction: column;
	  min-height: 100vh;
	  background-color: #f5f5f5;
	  font-family: "Microsoft YaHei", sans-serif;
	  position: relative;
	}
	
	/* 顶部比赛信息 */
	.match-header {
	  background-color: white;
	  padding: 15px 20px;
	  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
	
	.match-info {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 15px;
	  padding-bottom: 10px;
	  border-bottom: 1px solid #eee;
	  width: 100%;
	}
	
	.close-btn {
	  font-size: 24px;
	  background: none;
	  border: none;
	  cursor: pointer;
	  color: #999;
	}
	
	.venue {
	  font-size: 18px;
	  font-weight: bold;
	  color: #333;
	}
	
	.match-number {
	  font-size: 16px;
	  color: #666;
	}
	
	/* 选手信息 */
	.players-display {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  gap: 30px;
	  padding: 10px 0;
	}
	
	.player {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
	
	.name {
	  font-size: 16px;
	  color: #333;
	  margin-bottom: 5px;
	}
	
	.score {
	  font-size: 24px;
	  font-weight: bold;
	  color: #1a5276;
	}
	
	.vs {
	  font-size: 18px;
	  font-weight: bold;
	  color: #c0392b;
	}
	
	/* 中间确认文字 */
	.confirmation-text {
	  flex: 1;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  font-size: 40px;
	  color: #333;
	  padding: 20px;
	  text-align: center;
	}
	
	/* 底部按钮组 */
	.button-group {
	  position: fixed;
	  bottom: 20px;
	  left: 25%;
	  right: 25%;
	  display: flex;
	  justify-content: center;
	  gap: 20px;
	}
	
	.cancel-btn {
	  background-color: #e74c3c;
	  color: white;
	  padding: 12px 40px;
	  border: none;
	  border-radius: 6px;
	  font-size: 16px;
	  cursor: pointer;
	  transition: all 0.2s;
	}
	
	.confirm-btn {
	  background-color: #3498db;
	  color: white;
	  padding: 12px 40px;
	  border: none;
	  border-radius: 6px;
	  font-size: 16px;
	  cursor: pointer;
	  transition: all 0.2s;
	}
	
	.cancel-btn:hover,
	.confirm-btn:hover {
	  opacity: 0.9;
	  transform: translateY(-2px);
	}
	
	@media (max-width: 768px) {
	  .button-group {
	    left: 10%;
	    right: 10%;
	  }
	}
	
	@media (max-width: 480px) {
	  .button-group {
	    left: 5%;
	    right: 5%;
	    flex-direction: column;
	    gap: 10px;
	    align-items: center;
	  }
	
	  .cancel-btn,
	  .confirm-btn {
	    width: 100%;
	    max-width: 200px;
	  }
	
	  .players-display {
	    gap: 15px;
	  }
	}
</style>