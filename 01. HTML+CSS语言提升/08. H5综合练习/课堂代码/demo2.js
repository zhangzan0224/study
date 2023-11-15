var doms = {
  // 视频元素
  video: document.querySelector('video'),
  btnPlay: document.querySelector('#btnPlay'),
  // 进度条相关元素
  progress: {
    // 进度条
    range: document.querySelector('#progress'),
    // 当前播放时间
    current: document.querySelector('#current'),
    // 总时间
    total: document.querySelector('#total'),
  },
  // 播放倍率的容器
  rate: document.querySelector('#rate'),
  // 音量相关元素
  volume: {
    // 滑动块
    range: document.querySelector('#volume input'),
    // 文本
    text: document.querySelector('#volume span'),
  },
  // 保存和设置按钮
  buttons: {
    save: document.querySelector('#save'),
    load: document.querySelector('#load'),
  },
  controls: document.querySelectorAll('.controls'),
};
// 视频元素加载成功之后进行初始化
doms.video.addEventListener('loadeddata', init)
// 初始化，1 设置文本
function init() {
  // 展示可操作区域
  for (var i = 0; i < doms.controls.length; i++) {
    doms.controls[i].style.display = 'block'
  }
  setProcess()
  setRate()
  setVolume()
}

// 设置进度条的函数
function setProcess() {
  // 设置进度条的文字
  var current = doms.video.currentTime;
  var duration = doms.video.duration;
  doms.progress.current.innerHTML = formatTime(current)
  doms.progress.total.innerHTML = formatTime(duration)
  // 设置进度条
  doms.progress.range.value = current / duration * 100
}
// 设置播放速率激活
function setRate() {
  var btns = doms.rate.querySelectorAll('button');
  for (var i = 0; i < btns.length; i++) {
    if (+btns[i].dataset.rate === doms.video.playbackRate) {
      btns[i].classList.add('active')
    } else {
      btns[i].classList.remove('active')
    }
  }
}
/**
 * 设置音量的功能函数
 */
function setVolume() {
  var volumeNum = doms.video.volume
  var percent = Math.floor(volumeNum * 100)
  if (doms.video.muted) {
    percent = 0
  }
  // 设置音量的文本
  doms.volume.text.innerHTML = percent + '%'
  // 设置音量的条
  doms.volume.range.value = percent
}
/**
 * 将秒转换为时分秒
 * @param {number} sec 秒
 * @returns {string}
 * @example {01:10:10}
 */
function formatTime(sec) {
  var hours = Math.floor(sec / 3600)
  sec -= hours * 3600
  var minutes = Math.floor(sec / 60)
  sec -= minutes * 60
  sec = Math.floor(sec)
  return format(hours) + ":" + format(minutes) + ":" + format(sec)
}
/**
 * 将时分秒添加0
 * @param {number} n 
 * @returns string
 */
function format(n) {
  return n < 10 ? '0' + n : '' + n
}
// 播放暂停按钮事件
doms.btnPlay.addEventListener('click', function () {
  if (doms.video.paused) {
    doms.video.play()
  } else {
    doms.video.pause()
  }
})
// 当时间更新的时候去更改进度
doms.video.addEventListener('timeupdate', setProcess)

// 播放进度进行修改时

doms.progress.range.addEventListener('input', function () {
  // console.log(this.value);
  // 设置视频播放的时间
  doms.video.currentTime = this.value / 100 * doms.video.duration
  setProcess()
})

// 点击播放倍率事件
var btns = doms.rate.querySelectorAll('button')
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', function () {
    doms.video.playbackRate = +this.dataset.rate
    setRate()
  })
}