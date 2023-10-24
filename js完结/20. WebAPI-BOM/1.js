var timerId;

// 开始（继续）
function start() {
  if (timerId) {
    // 当前已经有计时器了
    return;
  }
  timerId = setInterval(function () {
    console.clear();
    console.log(new Date().toLocaleString());
  }, 1000);
}

// 停止
function stop() {
  clearInterval(timerId);
  timerId = null; // 不清空会导致问题，因为是判断了计时器存在的情况下，回return就开启不了计时器了
}