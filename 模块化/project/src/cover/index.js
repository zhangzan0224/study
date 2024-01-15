import $ from 'jquery';
import styles from './index.module.less';
import videoUrl from '../assets/movie.mp4';
import audioUrl from '../assets/music.mp3';
console.log(videoUrl)

function init() {
  const container = $('<div>').addClass(styles.container).appendTo('#app');
  $('<h1>').text('豆瓣电影').addClass(styles.title).appendTo(container);
  const vdom = $('<video>').prop('src', videoUrl).prop('autoplay', false).prop('loop', true).prop('muted', 'muted').addClass(styles.video).appendTo(container);
  const adom = $('<audio>').prop('src', audioUrl).prop('autoplay', false).prop('loop', true).prop('muted', 'muted').appendTo(container);
  $(window).on('scroll', function () {
    const scrollTop = document.documentElement.scrollTop;
    const vHeight = document.documentElement.clientHeight;
    if (scrollTop >= vHeight) {
      vdom[0] && vdom[0].pause();
      adom[0] && adom[0].pause();
    } else {
      vdom[0] && vdom[0].play();
      adom[0] && adom[0].play();
    }
  })
}
init()