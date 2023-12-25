import {
  createApp
} from 'vue'
import App from './App.vue'
import './index.css'
// import gsap from 'gsap'
createApp(App).mount('#app')

// const obj = {
//   count: 0
// }
// gsap.to(obj, {
//   count: 100,
//   duration: 3,
//   onUpdate: () => {
//     console.log(obj.count)
//   }
// })