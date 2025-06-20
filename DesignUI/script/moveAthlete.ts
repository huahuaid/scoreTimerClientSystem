import { type Player,type Zone, type Position } from '@/interface/interface'
import {playSwapAnimation,zoneBallPosition} from '@/script/animationAthlete'
import {ref} from 'vue'

const countLeft = ref(0);
const countRight = ref(0);
const venue = ref();
const isStartGame = ref(false);
const gameOverVisible = ref(false);
const dialogVisible = ref(false);
const leftPlayers = ref<Player[]>([
	{ id: 1, name: "B1", exists: true, position: "up" },
	{ id: 3, name: "B2", exists: true, position: "down" },
]);
const rightPlayers = ref<Player[]>([
	{ id: 2, name: "A1", exists: true, position: "up" },
	{ id: 4, name: "A2", exists: true, position: "down" },
]);

const ballBottomHight = 450
const ballRightWidth = 1020
const leftWidth = 480;
const rightWidth = 1000;
const topHight = 300;
const bottomHight = 550;
const currentGame = ref(0);
const isVisible = ref(false);
const ballPosition = ref({
	x: rightWidth,
	y: topHight,
});
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

const isDoubleGame = ref(true);
const isChangeSide = ref(false);
const bigLeft = ref(0);
const bigRight = ref(0);
const diagonalPairs: Record<Zone, Zone> = {
	"top-left": "top-right",
	"bottom-left": "bottom-left",
	"top-right": "top-right",
	"bottom-right": "bottom-left",
};
const zoneCenters: Record<Zone, Position> = {
	"top-right": { x: rightWidth, y: topHight },
	"bottom-left": { x: leftWidth, y: bottomHight },
	"top-left": { x: 0, y: 0 },
	"bottom-right": { x: 0, y: 0 }
};
const smallLeft = ref(0);
const smallRight = ref(0);

const checkScore = () => {
	if (smallLeft.value >= 21) {
		bigLeft.value++;
		resetSmallScores();
	} else if (smallRight.value >= 21) {
		bigRight.value++;
		resetSmallScores();
	}
};

const resetSmallScores = () => {
	currentGame.value++;
	smallLeft.value = 0;
	smallRight.value = 0;
	stopTimer();
	resetTimer();
	swapAllPlayers();
	[bigLeft.value, bigRight.value] = [bigRight.value, bigLeft.value];
	dialogVisible.value = !dialogVisible.value;
	if (bigLeft.value == 2 || bigRight.value == 2) {
		gameOverVisible.value = true;
	}
};

let draggedIndex:any;
let draggedSide:any;

const onCancel = () => {
	isVisible.value = false;
};

const onConfirm = () => {
	isVisible.value = false;
	startTimer();
};

const onDragStart = (index:any, side:any) => {
	draggedIndex = index;
	draggedSide = side;
};

const onDrop = async (index: number, side: 'left' | 'right') => {
	if (draggedSide === side && draggedIndex !== null) {
		if (draggedIndex !== index) {
			// 播放交换动画
			await playSwapAnimation(side, draggedIndex, index,0);

			if (side === "left") {
				// Swap players
				const temp = leftPlayers.value[draggedIndex];
				leftPlayers.value[draggedIndex] = leftPlayers.value[index];
				leftPlayers.value[index] = temp;

				// Update positions
				leftPlayers.value[draggedIndex].position =
					leftPlayers.value[draggedIndex].position === "up" ? "down" : "up";
				leftPlayers.value[index].position =
					leftPlayers.value[index].position === "up" ? "down" : "up";
			} else if (side === "right") {
				// Swap players
				const temp = rightPlayers.value[draggedIndex];
				rightPlayers.value[draggedIndex] = rightPlayers.value[index];
				rightPlayers.value[index] = temp;

				// Update positions
				rightPlayers.value[draggedIndex].position =
					rightPlayers.value[draggedIndex].position === "up" ? "down" : "up";
				rightPlayers.value[index].position =
					rightPlayers.value[index].position === "up" ? "down" : "up";
			}
		}
	}
};

function getScreenZone(x:any, y:any):Zone {
	const horizontal = x <= ballRightWidth ? "left" : "right";
	const vertical = y <= ballBottomHight ? "top" : "bottom";
	return `${vertical}-${horizontal}`; // 例如 "top-left"
}

function getZoneCenter(zone: Zone): Position {
	const targetZone = diagonalPairs[zone];
	const center = zoneCenters[targetZone];

	if (!center) {
		throw new Error(`Invalid zone: ${zone}`);
	}

	return center;
}

const swapAllPlayers = () => {
	[leftPlayers.value, rightPlayers.value] = [rightPlayers.value, leftPlayers.value];
	const currentZone = getScreenZone(ballPosition.value.x, ballPosition.value.y);
	const mirroredZone = getMirroredZone(currentZone);
	const targetPos = getZoneCenter(mirroredZone);
	ballPosition.value = targetPos;
};



function getMirroredZone(zone: Zone): Zone {
	if (zone.includes("left")) {
		return "top-right";  // 所有 left 区域 → bottom-right
	} else {
		return "bottom-left";   // 所有 right 区域 → bottom-left
	}
}


// single change
const swapId2AndId3 = () => {
	isChangeSide.value = !isChangeSide.value;

	// 查找ID为2和3的球员
	const findPlayer = (players: any[], id: number) => 
		players.find(player => player.id === id);

	const id2PlayerLeft = findPlayer(leftPlayers.value, 2);
	const id3PlayerLeft = findPlayer(leftPlayers.value, 3);
	const id2PlayerRight = findPlayer(rightPlayers.value, 2);
	const id3PlayerRight = findPlayer(rightPlayers.value, 3);

	// 交换信息（保留ID不变）
	const swapInfo = (player1: any, player2: any) => {
		if (!player1 || !player2) return;

		// 保存原始ID
		const id1 = player1.id;
		const id2 = player2.id;

		// 交换所有其他属性
		const temp = {...player1};
		Object.assign(player1, player2);
		Object.assign(player2, temp);

		// 恢复原始ID
		player1.id = id1;
		player2.id = id2;
	};

	// 执行交换
	if (id2PlayerLeft && id3PlayerRight) {
		swapInfo(id2PlayerLeft, id3PlayerRight);
	}

	if (id3PlayerLeft && id2PlayerRight) {
		swapInfo(id3PlayerLeft, id2PlayerRight);
	}
	console.log(leftPlayers.value,rightPlayers.value);

};

// begin game
const startMatch = () => {
	if(getBallZone(ballPosition.value.x,ballPosition.value.y)=='left-bottom'){
		countLeft.value++
	}else{
		countRight.value++
	}

	isStartGame.value = true;
	isVisible.value = true;
};

const swapLeftPositions = () => {
	leftPlayers.value = [...leftPlayers.value].reverse().map((player) => ({
		...player,
		position: player.position === "up" ? "down" : "up",
	}));
};

const swapRightPositions = () => {
	rightPlayers.value = [...rightPlayers.value].reverse().map((player) => ({
		...player,
		position: player.position === "up" ? "down" : "up",
	}));
};

const seconds = ref(0);
const timer = ref<any>(null);
const formattedTime = ref("00:00");

const startTimer = () => {
	timer.value = setInterval(() => {
		seconds.value++;
		formatTime();
	}, 1000);
};

const stopTimer = () => {
	clearInterval(timer.value as number);
	timer.value = null;
};

const resetTimer = () => {
	stopTimer();
	seconds.value = 0;
	formattedTime.value = "00:00";
};

const formatTime = () => {
	const minutes = Math.floor(seconds.value / 60);
	const remainingSeconds = seconds.value % 60;
	formattedTime.value = `${minutes
.toString()
.padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const dialogPopup = () => {
	dialogVisible.value = !dialogVisible.value;
	isStartGame.value = !isStartGame.value;
};

const resetGame = () => {
	isDoubleGame.value = false;
	currentGame.value = 0;
	smallLeft.value = 0;
	smallRight.value = 0;
	bigLeft.value = 0;
	bigRight.value = 0;
	leftPlayers.value = getInitialLeftPlayers();
	rightPlayers.value = getInitialRightPlayers();
	dialogVisible.value = false;
};

const DoubleInitialPlayers = () => {
	leftPlayers.value = getInitialLeftPlayers();
	rightPlayers.value = getInitialRightPlayers();
};

const getInitialLeftPlayers = () :Player[]  => [
	{ id: 1, name: "B1", exists: true, position: "up" },
	{ id: 3, name: "B2", exists: true, position: "down" },
];

const getInitialRightPlayers = () :Player[] => [
	{ id: 2, name: "A1", exists: true, position: "up" },
	{ id: 4, name: "A2", exists: true, position: "down" },
];

const SingleInitialPlayers = () => {
	leftPlayers.value = getSingleInitialLeftPlayers();
	rightPlayers.value = getSingleInitialRightPlayers();
};

const getSingleInitialLeftPlayers = ():Player[]  => [
	{ id: 1, name: "B1", exists: false, position: "up" },
	{ id: 3, name: "B2", exists: true, position: "down" },
];

const getSingleInitialRightPlayers = ():Player[] => [
	{ id: 2, name: "A1", exists: true, position: "up" },
	{ id: 4, name: "A2", exists: false, position: "down" },
];

function getBallZone(x:any, y:any) {
	const isLeft = x <= leftWidth;
	const isTop = y <= topHight;

	if (isLeft && isTop) return "left-top"; 
	if (isLeft && !isTop) return "left-bottom";
	if (!isLeft && isTop) return "right-top"; // 右上发球区
	return "right-bottom"; // 右下发球区
}

const printPositions = async () => {
	const ballZone = getBallZone(ballPosition.value.x, ballPosition.value.y);
	const zoneNames = {
		"left-top": "左上发球区",
		"left-bottom": "左下发球区",
		"right-top": "右上发球区",
		"right-bottom": "右下发球区",
	};
	const gameData = {
		venue: {
			venue:  decodeURIComponent(venue.value),
		},
		matchInfo: {
			status: isStartGame.value ? "已开始" : "未开始",
			mode: isDoubleGame.value ? "双打" : "单打",
			currentGame: currentGame.value + 1,
		},
		scores: {
			bigScores: {
				left: bigLeft.value,
				right: bigRight.value,
			},
			smallScores: {
				left: smallLeft.value,
				right: smallRight.value,
			},
		},
		ballPosition: {
			x: ballPosition.value.x,
			y: ballPosition.value.y,
			zone: zoneNames[ballZone],
			zoneKey: ballZone,
		},
		players: {
			leftTeam: leftPlayers.value.map((player) => ({
				name: player.name,
				position: player.position === "up" ? "left" : "right",
				positionKey: player.position,
				status: player.exists ? "在场" : "离场",
				exists: player.exists,
			})),
			rightTeam: rightPlayers.value.map((player) => ({
				name: player.name,
				position: player.position === "up" ? "right" : "left",
				positionKey: player.position,
				status: player.exists ? "在场" : "离场",
				exists: player.exists,
			})),
		},
		timestamp: new Date().toISOString(),
	};
	console.log("==== 当前比赛状态 ====");
	console.log(JSON.stringify(gameData, null, 2));
	console.log("========================");
	// 发送数据到后端
	try {
	    const response = await new Promise((resolve, reject) => {
	        uni.request({
	            url: 'http://192.168.60.1:8080/api/sse/broadcast',
	            method: 'POST',
	            header: {
	                'Content-Type': 'application/json',
	            },
	            data: gameData,
	            success: (res) => {
	                if (res.statusCode === 200) {
	                    resolve(res.data);
	                } else {
	                    reject(new Error('网络响应不正常'));
	                }
	            },
	            fail: (err) => {
	                reject(err);
	            }
	        });
	    });
	
	    console.log('服务器响应:', response);
	} catch (error) {
	    console.error('发送数据时出错:', error);
	}
	
	return gameData;
};

const incrementLeft = async () => {
	if (!isStartGame.value) {
		return;
	}
	countLeft.value++;
	countRight.value = 0;
	smallLeft.value++;
	if (!isDoubleGame.value) {
		let b2Player = leftPlayers.value.find((player) => player.id === 3) as any;
		
		if (smallLeft.value % 2 == 0) {
			if (b2Player.position != "down") {
				await Promise.all([
					zoneBallPosition(2),
					playSwapAnimation('left',0,1,0),
					playSwapAnimation('right',0,1,0)
				])
				swapLeftPositions();
				swapRightPositions();
			}else{
				zoneBallPosition(2)
			}
		} else {
			if (b2Player.position != "up") {
				await Promise.all([
					zoneBallPosition(1),
					playSwapAnimation('left',0,1,1),
					playSwapAnimation('right',0,1,1)
				])
				swapLeftPositions();
				swapRightPositions();
			}else{
				zoneBallPosition(1)
			}
		}
	} else {
		if (smallLeft.value % 2 == 0) {
			zoneBallPosition(2)
		} else {
			zoneBallPosition(1)
		}
		if (countLeft.value > 1) {
			await playSwapAnimation('left',0,1,0)
			swapLeftPositions();
		}
	}
	printPositions();
	checkScore();
};

const incrementRight = async () => {
	if (!isStartGame.value) {
		return;
	}
	countRight.value++;
	countLeft.value = 0;
	smallRight.value++;
	if (!isDoubleGame.value) {
		let a1Player = rightPlayers.value.find((player) => player.id === 2) as any;

		if (smallRight.value % 2 == 0) {
			if (a1Player.position != "up") {
				await Promise.all([
					zoneBallPosition(3),
					playSwapAnimation('right', 0, 1, 0),
					playSwapAnimation('left', 0, 1, 0)
				]);
				swapLeftPositions();
				swapRightPositions();
			}else{
				await zoneBallPosition(3)
			}
		} else {
			if (a1Player.position != "down") {
				await Promise.all([
					zoneBallPosition(4),
					playSwapAnimation('right', 0, 1, 0),
					playSwapAnimation('left', 0, 1, 0)
				]);
				swapLeftPositions();
				swapRightPositions();
			}else{
				await zoneBallPosition(4)
			}
		}
	} else {
		if (smallRight.value % 2 == 0) {
			zoneBallPosition(3)
		} else {
			zoneBallPosition(4)
		}
		if (countRight.value > 1) {
			await playSwapAnimation('right',0,1,0)
			swapRightPositions();
		}
	}
	printPositions();
	checkScore();
};

const onBallDragStart = (e:any) => {
	const ball = document.querySelector('.ball') as HTMLElement;
	if (ball) {
		ball.style.transition = 'none';
	}
	isDragging = true;
	dragOffset.x = e.clientX - ballPosition.value.x;
	dragOffset.y = e.clientY - ballPosition.value.y;
	e.dataTransfer.setDragImage(new Image(), 0, 0);
};

const onBallDrag = (e:any) => {
	if (isDragging && e.clientX !== 0 && e.clientY !== 0) {
		ballPosition.value = {
			x: e.clientX - dragOffset.x,
			y: e.clientY - dragOffset.y,
		};
	}
};

const onBallDragEnd = () => {
	isDragging = false;
	const zone = getScreenZone(ballPosition.value.x, ballPosition.value.y);
	const targetPos = getZoneCenter(zone);
	ballPosition.value = targetPos;
	const ball = document.querySelector('.ball') as HTMLElement;
	if (ball) {
		ball.style.transition = 'all 0.5s ease';
	}
};

export {
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
	leftWidth,
	rightWidth,
	topHight,
	bottomHight
}