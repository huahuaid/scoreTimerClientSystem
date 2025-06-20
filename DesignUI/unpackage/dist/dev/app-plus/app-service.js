if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_LOAD = "onLoad";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const playSwapAnimation = async (side, index1, index2, position) => {
  };
  const zoneBallPosition = async (num) => {
    switch (num) {
      case 0:
        return;
      case 1:
        ballPosition.value.x = leftWidth;
        ballPosition.value.y = topHight;
        break;
      case 2:
        ballPosition.value.x = leftWidth;
        ballPosition.value.y = bottomHight;
        break;
      case 3:
        ballPosition.value.x = rightWidth;
        ballPosition.value.y = topHight;
        break;
      case 4:
        ballPosition.value.x = rightWidth;
        ballPosition.value.y = bottomHight;
        break;
    }
  };
  const countLeft = vue.ref(0);
  const countRight = vue.ref(0);
  const venue = vue.ref();
  const isStartGame = vue.ref(false);
  const gameOverVisible = vue.ref(false);
  const dialogVisible = vue.ref(false);
  const leftPlayers = vue.ref([
    { id: 1, name: "B1", exists: true, position: "up" },
    { id: 3, name: "B2", exists: true, position: "down" }
  ]);
  const rightPlayers = vue.ref([
    { id: 2, name: "A1", exists: true, position: "up" },
    { id: 4, name: "A2", exists: true, position: "down" }
  ]);
  const ballBottomHight = 450;
  const ballRightWidth = 1020;
  const leftWidth = 480;
  const rightWidth = 1e3;
  const topHight = 300;
  const bottomHight = 550;
  const currentGame = vue.ref(0);
  const isVisible = vue.ref(false);
  const ballPosition = vue.ref({
    x: rightWidth,
    y: topHight
  });
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  const isDoubleGame = vue.ref(true);
  const isChangeSide = vue.ref(false);
  const bigLeft = vue.ref(0);
  const bigRight = vue.ref(0);
  const diagonalPairs = {
    "top-left": "top-right",
    "bottom-left": "bottom-left",
    "top-right": "top-right",
    "bottom-right": "bottom-left"
  };
  const zoneCenters = {
    "top-right": { x: rightWidth, y: topHight },
    "bottom-left": { x: leftWidth, y: bottomHight },
    "top-left": { x: 0, y: 0 },
    "bottom-right": { x: 0, y: 0 }
  };
  const smallLeft = vue.ref(0);
  const smallRight = vue.ref(0);
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
  let draggedIndex;
  let draggedSide;
  const onCancel = () => {
    isVisible.value = false;
  };
  const onConfirm = () => {
    isVisible.value = false;
    startTimer();
  };
  const onDragStart = (index, side) => {
    draggedIndex = index;
    draggedSide = side;
  };
  const onDrop = async (index, side) => {
    if (draggedSide === side && draggedIndex !== null) {
      if (draggedIndex !== index) {
        await playSwapAnimation();
        if (side === "left") {
          const temp = leftPlayers.value[draggedIndex];
          leftPlayers.value[draggedIndex] = leftPlayers.value[index];
          leftPlayers.value[index] = temp;
          leftPlayers.value[draggedIndex].position = leftPlayers.value[draggedIndex].position === "up" ? "down" : "up";
          leftPlayers.value[index].position = leftPlayers.value[index].position === "up" ? "down" : "up";
        } else if (side === "right") {
          const temp = rightPlayers.value[draggedIndex];
          rightPlayers.value[draggedIndex] = rightPlayers.value[index];
          rightPlayers.value[index] = temp;
          rightPlayers.value[draggedIndex].position = rightPlayers.value[draggedIndex].position === "up" ? "down" : "up";
          rightPlayers.value[index].position = rightPlayers.value[index].position === "up" ? "down" : "up";
        }
      }
    }
  };
  function getScreenZone(x, y) {
    const horizontal = x <= ballRightWidth ? "left" : "right";
    const vertical = y <= ballBottomHight ? "top" : "bottom";
    return `${vertical}-${horizontal}`;
  }
  function getZoneCenter(zone) {
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
  function getMirroredZone(zone) {
    if (zone.includes("left")) {
      return "top-right";
    } else {
      return "bottom-left";
    }
  }
  const swapId2AndId3 = () => {
    isChangeSide.value = !isChangeSide.value;
    const findPlayer = (players, id) => players.find((player) => player.id === id);
    const id2PlayerLeft = findPlayer(leftPlayers.value, 2);
    const id3PlayerLeft = findPlayer(leftPlayers.value, 3);
    const id2PlayerRight = findPlayer(rightPlayers.value, 2);
    const id3PlayerRight = findPlayer(rightPlayers.value, 3);
    const swapInfo = (player1, player2) => {
      if (!player1 || !player2)
        return;
      const id1 = player1.id;
      const id2 = player2.id;
      const temp = { ...player1 };
      Object.assign(player1, player2);
      Object.assign(player2, temp);
      player1.id = id1;
      player2.id = id2;
    };
    if (id2PlayerLeft && id3PlayerRight) {
      swapInfo(id2PlayerLeft, id3PlayerRight);
    }
    if (id3PlayerLeft && id2PlayerRight) {
      swapInfo(id3PlayerLeft, id2PlayerRight);
    }
    formatAppLog("log", "at script/moveAthlete.ts:203", leftPlayers.value, rightPlayers.value);
  };
  const startMatch = () => {
    if (getBallZone(ballPosition.value.x, ballPosition.value.y) == "left-bottom") {
      countLeft.value++;
    } else {
      countRight.value++;
    }
    isStartGame.value = true;
    isVisible.value = true;
  };
  const swapLeftPositions = () => {
    leftPlayers.value = [...leftPlayers.value].reverse().map((player) => ({
      ...player,
      position: player.position === "up" ? "down" : "up"
    }));
  };
  const swapRightPositions = () => {
    rightPlayers.value = [...rightPlayers.value].reverse().map((player) => ({
      ...player,
      position: player.position === "up" ? "down" : "up"
    }));
  };
  const seconds = vue.ref(0);
  const timer = vue.ref(null);
  const formattedTime = vue.ref("00:00");
  const startTimer = () => {
    timer.value = setInterval(() => {
      seconds.value++;
      formatTime();
    }, 1e3);
  };
  const stopTimer = () => {
    clearInterval(timer.value);
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
    formattedTime.value = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const DoubleInitialPlayers = () => {
    leftPlayers.value = getInitialLeftPlayers();
    rightPlayers.value = getInitialRightPlayers();
  };
  const getInitialLeftPlayers = () => [
    { id: 1, name: "B1", exists: true, position: "up" },
    { id: 3, name: "B2", exists: true, position: "down" }
  ];
  const getInitialRightPlayers = () => [
    { id: 2, name: "A1", exists: true, position: "up" },
    { id: 4, name: "A2", exists: true, position: "down" }
  ];
  const SingleInitialPlayers = () => {
    leftPlayers.value = getSingleInitialLeftPlayers();
    rightPlayers.value = getSingleInitialRightPlayers();
  };
  const getSingleInitialLeftPlayers = () => [
    { id: 1, name: "B1", exists: false, position: "up" },
    { id: 3, name: "B2", exists: true, position: "down" }
  ];
  const getSingleInitialRightPlayers = () => [
    { id: 2, name: "A1", exists: true, position: "up" },
    { id: 4, name: "A2", exists: false, position: "down" }
  ];
  function getBallZone(x, y) {
    const isLeft = x <= leftWidth;
    const isTop = y <= topHight;
    if (isLeft && isTop)
      return "left-top";
    if (isLeft && !isTop)
      return "left-bottom";
    if (!isLeft && isTop)
      return "right-top";
    return "right-bottom";
  }
  const printPositions = async () => {
    const ballZone = getBallZone(ballPosition.value.x, ballPosition.value.y);
    const zoneNames = {
      "left-top": "左上发球区",
      "left-bottom": "左下发球区",
      "right-top": "右上发球区",
      "right-bottom": "右下发球区"
    };
    const gameData = {
      venue: {
        venue: decodeURIComponent(venue.value)
      },
      matchInfo: {
        status: isStartGame.value ? "已开始" : "未开始",
        mode: isDoubleGame.value ? "双打" : "单打",
        currentGame: currentGame.value + 1
      },
      scores: {
        bigScores: {
          left: bigLeft.value,
          right: bigRight.value
        },
        smallScores: {
          left: smallLeft.value,
          right: smallRight.value
        }
      },
      ballPosition: {
        x: ballPosition.value.x,
        y: ballPosition.value.y,
        zone: zoneNames[ballZone],
        zoneKey: ballZone
      },
      players: {
        leftTeam: leftPlayers.value.map((player) => ({
          name: player.name,
          position: player.position === "up" ? "left" : "right",
          positionKey: player.position,
          status: player.exists ? "在场" : "离场",
          exists: player.exists
        })),
        rightTeam: rightPlayers.value.map((player) => ({
          name: player.name,
          position: player.position === "up" ? "right" : "left",
          positionKey: player.position,
          status: player.exists ? "在场" : "离场",
          exists: player.exists
        }))
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    formatAppLog("log", "at script/moveAthlete.ts:371", "==== 当前比赛状态 ====");
    formatAppLog("log", "at script/moveAthlete.ts:372", JSON.stringify(gameData, null, 2));
    formatAppLog("log", "at script/moveAthlete.ts:373", "========================");
    try {
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url: "http://192.168.60.1:8080/api/sse/broadcast",
          method: "POST",
          header: {
            "Content-Type": "application/json"
          },
          data: gameData,
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.data);
            } else {
              reject(new Error("网络响应不正常"));
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
      formatAppLog("log", "at script/moveAthlete.ts:397", "服务器响应:", response);
    } catch (error) {
      formatAppLog("error", "at script/moveAthlete.ts:399", "发送数据时出错:", error);
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
      let b2Player = leftPlayers.value.find((player) => player.id === 3);
      if (smallLeft.value % 2 == 0) {
        if (b2Player.position != "down") {
          await Promise.all([
            zoneBallPosition(2),
            playSwapAnimation(),
            playSwapAnimation()
          ]);
          swapLeftPositions();
          swapRightPositions();
        } else {
          zoneBallPosition(2);
        }
      } else {
        if (b2Player.position != "up") {
          await Promise.all([
            zoneBallPosition(1),
            playSwapAnimation(),
            playSwapAnimation()
          ]);
          swapLeftPositions();
          swapRightPositions();
        } else {
          zoneBallPosition(1);
        }
      }
    } else {
      if (smallLeft.value % 2 == 0) {
        zoneBallPosition(2);
      } else {
        zoneBallPosition(1);
      }
      if (countLeft.value > 1) {
        await playSwapAnimation();
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
      let a1Player = rightPlayers.value.find((player) => player.id === 2);
      if (smallRight.value % 2 == 0) {
        if (a1Player.position != "up") {
          await Promise.all([
            zoneBallPosition(3),
            playSwapAnimation(),
            playSwapAnimation()
          ]);
          swapLeftPositions();
          swapRightPositions();
        } else {
          await zoneBallPosition(3);
        }
      } else {
        if (a1Player.position != "down") {
          await Promise.all([
            zoneBallPosition(4),
            playSwapAnimation(),
            playSwapAnimation()
          ]);
          swapLeftPositions();
          swapRightPositions();
        } else {
          await zoneBallPosition(4);
        }
      }
    } else {
      if (smallRight.value % 2 == 0) {
        zoneBallPosition(3);
      } else {
        zoneBallPosition(4);
      }
      if (countRight.value > 1) {
        await playSwapAnimation();
        swapRightPositions();
      }
    }
    printPositions();
    checkScore();
  };
  const onBallDragStart = (e) => {
    const ball = document.querySelector(".ball");
    if (ball) {
      ball.style.transition = "none";
    }
    isDragging = true;
    dragOffset.x = e.clientX - ballPosition.value.x;
    dragOffset.y = e.clientY - ballPosition.value.y;
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };
  const onBallDrag = (e) => {
    if (isDragging && e.clientX !== 0 && e.clientY !== 0) {
      ballPosition.value = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
    }
  };
  const onBallDragEnd = () => {
    isDragging = false;
    const zone = getScreenZone(ballPosition.value.x, ballPosition.value.y);
    const targetPos = getZoneCenter(zone);
    ballPosition.value = targetPos;
    const ball = document.querySelector(".ball");
    if (ball) {
      ball.style.transition = "all 0.5s ease";
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$4 = {
    __name: "GameStartComponent",
    emits: ["cancel", "confirm", "close"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit = __emit;
      const currentMatch = vue.ref({
        venue: "10",
        players: ["张永棋", "张端端"],
        roundsWon: [0, 0]
      });
      const handleClose = () => {
        emit("close");
      };
      const handleCancel = () => {
        emit("cancel");
      };
      const handleConfirm = () => {
        emit("confirm");
      };
      const __returned__ = { emit, currentMatch, handleClose, handleCancel, handleConfirm, get currentGame() {
        return currentGame;
      }, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "match-confirmation" }, [
      vue.createCommentVNode(" 顶部比赛信息 "),
      vue.createElementVNode("div", { class: "match-header" }, [
        vue.createElementVNode("div", { class: "match-info" }, [
          vue.createElementVNode(
            "span",
            { class: "venue" },
            "场地" + vue.toDisplayString($setup.currentMatch.venue),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "span",
            { class: "match-number" },
            "第" + vue.toDisplayString($setup.currentGame) + "场",
            1
            /* TEXT */
          ),
          vue.createElementVNode("button", {
            class: "close-btn",
            onClick: $setup.handleClose
          }, "×")
        ]),
        vue.createElementVNode("div", { class: "players-display" }, [
          vue.createElementVNode("div", { class: "player" }, [
            vue.createElementVNode(
              "div",
              { class: "name" },
              vue.toDisplayString($setup.currentMatch.players[0]),
              1
              /* TEXT */
            ),
            vue.createElementVNode("div", { class: "score" }, "00"),
            vue.createElementVNode(
              "div",
              { class: "rounds-won" },
              "已胜回合: " + vue.toDisplayString($setup.currentMatch.roundsWon[0]),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("div", { class: "vs" }, "VS"),
          vue.createElementVNode("div", { class: "player" }, [
            vue.createElementVNode(
              "div",
              { class: "name" },
              vue.toDisplayString($setup.currentMatch.players[1]),
              1
              /* TEXT */
            ),
            vue.createElementVNode("div", { class: "score" }, "00"),
            vue.createElementVNode(
              "div",
              { class: "rounds-won" },
              "已胜回合: " + vue.toDisplayString($setup.currentMatch.roundsWon[1]),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createCommentVNode(" 中间确认文字 "),
      vue.createElementVNode("div", { class: "confirmation-text" }, " 确认开始第1局比赛吗？ "),
      vue.createCommentVNode(" 底部操作按钮 "),
      vue.createElementVNode("div", { class: "button-group" }, [
        vue.createElementVNode("button", {
          onClick: $setup.handleCancel,
          class: "cancel-btn"
        }, "取消"),
        vue.createElementVNode("button", {
          onClick: $setup.handleConfirm,
          class: "confirm-btn"
        }, "确认")
      ])
    ]);
  }
  const GameStartComponent = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-89e99334"], ["__file", "F:/scoreTimerClientSystem/DesignUI/compents/GameStartComponent.vue"]]);
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "ScoreTimer",
    setup(__props, { expose: __expose }) {
      __expose();
      const description = vue.ref("");
      const players = vue.ref([]);
      const avatar = vue.ref("");
      const matchId = vue.ref("");
      const gameType = vue.ref("");
      onLoad((options) => {
        stopTimer();
        venue.value = options.venue || "";
        description.value = options.description || "";
        avatar.value = options.avatar || "";
        matchId.value = options.matchId || "";
        gameType.value = options.gameType || "";
        players.value = [
          options.player1 || "",
          options.player2 || "",
          options.player3 || "",
          options.player4 || ""
        ].filter((p) => p);
        const hasPlayer4 = "player4" in options && options.player4;
        if (hasPlayer4) {
          isDoubleGame.value = true;
          DoubleInitialPlayers();
        } else {
          countLeft.value = 1;
          countRight.value = 1;
          isDoubleGame.value = false;
          SingleInitialPlayers();
        }
        formatAppLog("log", "at pages/views/ScoreTimer.vue:134", "接收到的比赛数据:", {
          venue: venue.value,
          description: description.value,
          players: players.value,
          avatar: avatar.value,
          matchId: matchId.value,
          gameType: gameType.value,
          isDoubleGame: isDoubleGame.value
        });
      });
      const __returned__ = { description, players, avatar, matchId, gameType, GameStartComponent, get onBallDragEnd() {
        return onBallDragEnd;
      }, get onBallDrag() {
        return onBallDrag;
      }, get onBallDragStart() {
        return onBallDragStart;
      }, get formattedTime() {
        return formattedTime;
      }, get leftPlayers() {
        return leftPlayers;
      }, get rightPlayers() {
        return rightPlayers;
      }, get ballPosition() {
        return ballPosition;
      }, get bigLeft() {
        return bigLeft;
      }, get bigRight() {
        return bigRight;
      }, get smallLeft() {
        return smallLeft;
      }, get smallRight() {
        return smallRight;
      }, get isVisible() {
        return isVisible;
      }, get incrementLeft() {
        return incrementLeft;
      }, get incrementRight() {
        return incrementRight;
      }, get swapAllPlayers() {
        return swapAllPlayers;
      }, get swapId2AndId3() {
        return swapId2AndId3;
      }, get startMatch() {
        return startMatch;
      }, get onDragStart() {
        return onDragStart;
      }, get onDrop() {
        return onDrop;
      }, get onCancel() {
        return onCancel;
      }, get onConfirm() {
        return onConfirm;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _imports_0$1 = "/static/image/One.png";
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["game-start-wrapper", { "visible": $setup.isVisible }])
      },
      [
        $setup.isVisible ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "GameStartComponent"
        }, [
          vue.createVNode($setup["GameStartComponent"], {
            onCancel: $setup.onCancel,
            onConfirm: $setup.onConfirm
          }, null, 8, ["onCancel", "onConfirm"])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "div",
          {
            class: "ball",
            draggable: "true",
            onDragstart: _cache[0] || (_cache[0] = (...args) => $setup.onBallDragStart && $setup.onBallDragStart(...args)),
            onDrag: _cache[1] || (_cache[1] = (...args) => $setup.onBallDrag && $setup.onBallDrag(...args)),
            onDragend: _cache[2] || (_cache[2] = (...args) => $setup.onBallDragEnd && $setup.onBallDragEnd(...args)),
            style: vue.normalizeStyle({ left: $setup.ballPosition.x + "px", top: $setup.ballPosition.y + "px" })
          },
          null,
          36
          /* STYLE, NEED_HYDRATION */
        ),
        vue.createElementVNode("view", { class: "left-add-score" }, [
          vue.createElementVNode("button", {
            class: "add-btn",
            onClick: _cache[3] || (_cache[3] = (...args) => $setup.incrementLeft && $setup.incrementLeft(...args))
          }, "+")
        ]),
        vue.createElementVNode("view", { class: "right-add-score" }, [
          vue.createElementVNode("button", {
            class: "add-btn",
            onClick: _cache[4] || (_cache[4] = (...args) => $setup.incrementRight && $setup.incrementRight(...args))
          }, "+")
        ]),
        vue.createElementVNode("view", { class: "page-wrapper" }, [
          vue.createElementVNode("view", { class: "container" }, [
            vue.createElementVNode("view", { class: "bar" }, [
              vue.createElementVNode("view", { class: "back-button" }, [
                vue.createElementVNode("button", null, "返回")
              ]),
              vue.createElementVNode("view", { class: "title" }, "huahua")
            ]),
            vue.createElementVNode("view", { class: "content-wrapper" }, [
              vue.createElementVNode("view", { class: "header" }, [
                vue.createElementVNode("text", { class: "title" }, "一局单打21分 D组[练CS010]")
              ]),
              vue.createElementVNode("view", { class: "CompetitionScore" }, [
                vue.createElementVNode(
                  "view",
                  { class: "big-score" },
                  vue.toDisplayString($setup.bigLeft) + " : " + vue.toDisplayString($setup.bigRight),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "small-score" },
                  vue.toDisplayString($setup.smallLeft.toString().padStart(2, "0")) + " : " + vue.toDisplayString($setup.smallRight.toString().padStart(2, "0")),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "content" }, [
                vue.createCommentVNode(" 左侧分区 "),
                vue.createElementVNode("view", { class: "player-info-left" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($setup.leftPlayers, (player, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        key: player.id,
                        draggable: "true",
                        onDragstart: ($event) => $setup.onDragStart(index, "left"),
                        onDragover: _cache[5] || (_cache[5] = vue.withModifiers(() => {
                        }, ["prevent"])),
                        onDrop: ($event) => $setup.onDrop(index, "left"),
                        class: "player",
                        style: vue.normalizeStyle({ opacity: player.exists ? 1 : 0 })
                      }, [
                        vue.createElementVNode("image", {
                          id: `left-avatar-${player.id}`,
                          src: _imports_0$1,
                          mode: "aspectFill",
                          class: "player-avatar"
                        }, null, 8, ["id"]),
                        vue.createElementVNode(
                          "text",
                          { class: "player-name" },
                          vue.toDisplayString(player.name),
                          1
                          /* TEXT */
                        )
                      ], 44, ["onDragstart", "onDrop"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode("view", { class: "player-info-right" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($setup.rightPlayers, (player, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        key: player.id,
                        draggable: "true",
                        onDragstart: ($event) => $setup.onDragStart(index, "right"),
                        onDragover: _cache[6] || (_cache[6] = vue.withModifiers(() => {
                        }, ["prevent"])),
                        onDrop: ($event) => $setup.onDrop(index, "right"),
                        class: "player",
                        style: vue.normalizeStyle({ opacity: player.exists ? 1 : 0 })
                      }, [
                        vue.createElementVNode("image", {
                          id: `right-avatar-${player.id}`,
                          src: _imports_0$1,
                          mode: "aspectFill",
                          class: "player-avatar"
                        }, null, 8, ["id"]),
                        vue.createElementVNode(
                          "text",
                          { class: "player-name" },
                          vue.toDisplayString(player.name),
                          1
                          /* TEXT */
                        )
                      ], 44, ["onDragstart", "onDrop"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ]),
            vue.createElementVNode(
              "view",
              { class: "Timer" },
              vue.toDisplayString($setup.formattedTime),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "actions" }, [
              vue.createElementVNode("button", {
                onClick: _cache[7] || (_cache[7] = (...args) => $setup.swapAllPlayers && $setup.swapAllPlayers(...args))
              }, "双方换边"),
              vue.createElementVNode("button", {
                onClick: _cache[8] || (_cache[8] = (...args) => $setup.swapId2AndId3 && $setup.swapId2AndId3(...args))
              }, "单打交换"),
              vue.createElementVNode("button", {
                onClick: _cache[9] || (_cache[9] = (...args) => $setup.startMatch && $setup.startMatch(...args))
              }, "开始比赛")
            ])
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesViewsScoreTimer = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-476b86be"], ["__file", "F:/scoreTimerClientSystem/DesignUI/pages/views/ScoreTimer.vue"]]);
  const _imports_0 = "/static/image/Head.png";
  const headImage = "/static/image/Head.png";
  const _sfc_main$2 = {
    __name: "playerDisplayBoard",
    setup(__props, { expose: __expose }) {
      __expose();
      const activeTab = vue.ref("ongoing");
      const menuItems = vue.ref(["签到", "直播", "录制视频"]);
      const showMenu = vue.ref(false);
      const matches = vue.ref([
        {
          id: 1,
          venue: "场地1",
          description: "第1场 一局单打21分 D组 [练CS010]",
          players: ["张永祺", "孙卫平", "hang", "gala"],
          status: "ongoing",
          scores: null
        },
        {
          id: 2,
          venue: "场地2",
          description: "第2场 一局单打21分 D组 [练CS058]",
          players: ["张永祺", "王梁荣"],
          status: "ongoing",
          scores: null
        }
      ]);
      const ongoingMatches = vue.computed(() => {
        return matches.value.filter((match) => match.status === "ongoing");
      });
      const completedMatches = vue.computed(() => {
        return matches.value.filter((match) => match.status === "completed");
      });
      const displayedMatches = vue.computed(() => {
        return activeTab.value === "ongoing" ? ongoingMatches.value : completedMatches.value;
      });
      const formatPlayerName = (name) => {
        if (name.includes("/")) {
          return name.split("/").join(" / ");
        }
        return name;
      };
      const goBack = () => {
        uni.navigateBack();
      };
      const toggleMenu = () => {
        showMenu.value = !showMenu.value;
      };
      const handleMenuItemClick = (item) => {
        formatAppLog("log", "at pages/views/playerDisplayBoard.vue:142", `选择了菜单项: ${item}`);
        showMenu.value = false;
        switch (item) {
          case "签到":
            uni.navigateTo({ url: "/pages/signin/signin" });
            break;
          case "直播":
            uni.navigateTo({ url: "/pages/live/live" });
            break;
          case "录制视频":
            uni.navigateTo({ url: "/pages/record/record" });
            break;
        }
      };
      const handleScoreClick = (match) => {
        formatAppLog("log", "at pages/views/playerDisplayBoard.vue:160", "HUAHUA");
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
        if (match.players[2])
          query.player3 = match.players[2];
        if (match.players[3])
          query.player4 = match.players[3];
        const queryString = Object.keys(query).map((key) => `${key}=${encodeURIComponent(query[key])}`).join("&");
        uni.navigateTo({
          url: `/pages/views/ScoreTimer?${queryString}`
        });
      };
      const __returned__ = { headImage, activeTab, menuItems, showMenu, matches, ongoingMatches, completedMatches, displayedMatches, formatPlayerName, goBack, toggleMenu, handleMenuItemClick, handleScoreClick, ref: vue.ref, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "referee-practice" }, [
      vue.createCommentVNode(" 标题栏 "),
      vue.createElementVNode("view", { class: "title-banner" }, [
        vue.createElementVNode("button", {
          class: "back-btn",
          onClick: $setup.goBack
        }, [
          vue.createElementVNode("image", {
            src: _imports_0,
            mode: "aspectFit",
            class: "back-icon"
          })
        ]),
        vue.createElementVNode("text", { class: "title-text" }, "超雄汇裁判员练习"),
        vue.createElementVNode("button", {
          class: "menu-button",
          onClick: $setup.toggleMenu
        }, "☰"),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "menu-bar" },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.menuItems, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "menu-item",
                  key: item,
                  onClick: ($event) => $setup.handleMenuItemClick(item)
                }, vue.toDisplayString(item), 9, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.showMenu]
        ])
      ]),
      vue.createElementVNode("view", { class: "content-container" }, [
        vue.createCommentVNode(" 状态标签 "),
        vue.createElementVNode("view", { class: "status-section" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["status-item", { active: $setup.activeTab === "ongoing" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.activeTab = "ongoing")
            },
            [
              vue.createElementVNode("text", { class: "status-title" }, "进行中"),
              vue.createElementVNode(
                "text",
                { class: "status-count" },
                "(" + vue.toDisplayString($setup.ongoingMatches.length) + ")",
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["status-item", { active: $setup.activeTab === "completed" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $setup.activeTab = "completed")
            },
            [
              vue.createElementVNode("text", { class: "status-title" }, "已完成"),
              vue.createElementVNode(
                "text",
                { class: "status-count" },
                "(" + vue.toDisplayString($setup.completedMatches.length) + ")",
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          )
        ]),
        vue.createCommentVNode(" 比赛列表 "),
        vue.createElementVNode("view", { class: "match-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.displayedMatches, (match, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "match-item",
                key: match.id
              }, [
                vue.createElementVNode("view", { class: "match-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "venue" },
                    vue.toDisplayString(match.venue),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "match-info" },
                    vue.toDisplayString(match.description),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "players-section" }, [
                  vue.createElementVNode("view", { class: "player-container" }, [
                    vue.createElementVNode("view", { class: "player-info" }, [
                      vue.createElementVNode("image", {
                        src: $setup.headImage,
                        class: "player-avatar",
                        mode: "aspectFill"
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "player-name" },
                        vue.toDisplayString($setup.formatPlayerName(match.players[0])),
                        1
                        /* TEXT */
                      ),
                      match.players[2] ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 0,
                          class: "player-name"
                        },
                        vue.toDisplayString($setup.formatPlayerName(match.players[2])),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true)
                    ]),
                    match.scores ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "score-display"
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(match.scores.player1.game1) + " - " + vue.toDisplayString(match.scores.player2.game1),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(match.scores.player1.game2) + " - " + vue.toDisplayString(match.scores.player2.game2),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(match.scores.player1.game3) + " - " + vue.toDisplayString(match.scores.player2.game3),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createElementVNode("text", { class: "vs" }, "VS"),
                  vue.createElementVNode("view", { class: "player-container" }, [
                    vue.createElementVNode("view", { class: "player-info" }, [
                      vue.createElementVNode("image", {
                        src: $setup.headImage,
                        class: "player-avatar",
                        mode: "aspectFill"
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "player-name" },
                        vue.toDisplayString($setup.formatPlayerName(match.players[1])),
                        1
                        /* TEXT */
                      ),
                      match.players[3] ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 0,
                          class: "player-name"
                        },
                        vue.toDisplayString($setup.formatPlayerName(match.players[3])),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true)
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "action-buttons" }, [
                  vue.createElementVNode("button", {
                    class: "score-btn",
                    type: "primary",
                    onClick: ($event) => $setup.handleScoreClick(match)
                  }, vue.toDisplayString(match.status === "completed" ? "重新签名" : "记分"), 9, ["onClick"])
                ]),
                index < $setup.displayedMatches.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "divider"
                })) : vue.createCommentVNode("v-if", true)
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $setup.displayedMatches.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "no-matches"
          }, " 暂无比赛数据 ")) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const PagesViewsPlayerDisplayBoard = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "F:/scoreTimerClientSystem/DesignUI/pages/views/playerDisplayBoard.vue"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const navData = vue.ref([
        { name: "首页", path: "/css/pages/index/index" },
        { name: "分数计时器", path: "/pages/views/ScoreTimer" },
        { name: "玩家展示板", path: "/pages/views/playerDisplayBoard" }
      ]);
      const navigateTo = (path) => {
        if (!path) {
          uni.showToast({
            title: "该页面路径未配置",
            icon: "none"
          });
          return;
        }
        {
          uni.navigateTo({
            url: path,
            fail: () => {
              uni.showToast({
                title: "页面不存在或路径错误",
                icon: "none"
              });
            }
          });
        }
      };
      const __returned__ = { navData, navigateTo };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 动态生成按钮 "),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.navData, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: "button-wrapper"
          }, [
            vue.createElementVNode("button", {
              class: "nav-button",
              onClick: ($event) => $setup.navigateTo(item.path)
            }, vue.toDisplayString(item.name || `页面${index + 1}`), 9, ["onClick"])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "F:/scoreTimerClientSystem/DesignUI/pages/index/index.vue"]]);
  __definePage("pages/views/ScoreTimer", PagesViewsScoreTimer);
  __definePage("pages/views/playerDisplayBoard", PagesViewsPlayerDisplayBoard);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "F:/scoreTimerClientSystem/DesignUI/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
