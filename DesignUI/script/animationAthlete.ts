import {
	ballPosition,
	leftWidth,
	rightWidth,
	topHight,
	bottomHight
} from '@/script/moveAthlete'

export const playSwapAnimation = async (side: 'left' | 'right', index1: number, index2: number, position: number) => {
	// // 获取容器元素
	// const container = document.querySelector(`.player-info-${side}`);
	// if (!container) return;

	// // 获取所有玩家卡片
	// const playerCards = container.querySelectorAll('.player');
	// if (index1 >= playerCards.length || index2 >= playerCards.length) return;

	// // 获取两个需要交换的元素（图片和名字）
	// const card1 = playerCards[index1];
	// const card2 = playerCards[index2];

	// const img1 = card1.querySelector('.player-avatar') as HTMLElement;
	// const img2 = card2.querySelector('.player-avatar') as HTMLElement;
	// const name1 = card1.querySelector('.player-name') as HTMLElement;
	// const name2 = card2.querySelector('.player-name') as HTMLElement;

	// if (!img1 || !img2 || !name1 || !name2) return;

	// // 计算两个卡片的位置差
	// const rect1 = img1.getBoundingClientRect();
	// const rect2 = img2.getBoundingClientRect();

	// const moveX1 = rect2.left - rect1.left;
	// const moveY1 = rect2.top - rect1.top;
	// const moveX2 = rect1.left - rect2.left;
	// const moveY2 = rect1.top - rect2.top;

	// // 为所有元素添加动画样式
	// [img1, img2, name1, name2].forEach(el => {
	// 	el.style.transition = 'transform 0.5s ease-in-out';
	// 	el.style.zIndex = '10';
	// });

	// // 执行移动动画
	// img1.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
	// img2.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
	// name1.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
	// name2.style.transform = `translate(${moveX2}px, ${moveY2}px)`;

	// zoneBallPosition(position);
	// // 等待动画完成
	// await new Promise(resolve => setTimeout(resolve, 500));


	// // 重置所有元素的样式
	// [img1, img2, name1, name2].forEach(el => {
	// 	el.style.transition = 'none';
	// 	el.style.transform = 'none';
	// 	el.style.zIndex = '';
	// });

	// // 强制重绘，防止动画重置闪烁
	// void img1.offsetHeight;
	// void img2.offsetHeight;
	// void name1.offsetHeight;
	// void name2.offsetHeight;
};

export const zoneBallPosition = async (num : number) =>{
	switch (num) {
		case 0:
			return
		case 1:
			ballPosition.value.x = leftWidth
			ballPosition.value.y = topHight
			break;
		case 2:
			ballPosition.value.x = leftWidth;
			ballPosition.value.y = bottomHight;
			break;
		case 3:
			ballPosition.value.x = rightWidth 
			ballPosition.value.y = topHight
			break;
		case 4:
			ballPosition.value.x = rightWidth 
			ballPosition.value.y = bottomHight
			break
	}
}