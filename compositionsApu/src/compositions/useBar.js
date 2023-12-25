import {
  computed,
  ref,
  watch
} from "vue"
import gsap from 'gsap'
const colors = ["#334552", "#B34335", "#6E9FA5", "#A2C3AC", "#C8846C"];
export default function userBar(gdpRef, maxLength) {
  const bars = ref([])
  const maxValue = computed(() => {
    return Math.max(...gdpRef.value.map(it => it.value))
  })
  // 瞬间变化
  const targetBars = computed(() => {
    // console.log('computed', gdpRef.value) 如果传递 props的某一个属性就是一个数组，不是响应式的，无法监测到变化
    return gdpRef.value.map((it, index) => {
      return {
        ...it,
        color: colors[index % colors.length],
        size: it.value / maxValue.value * maxLength
      }
    })
  })
  watch(targetBars,
    () => {
      // 从 bars 变化到 targetBars
      for (let index = 0; index < targetBars.value.length; index++) {
        if (!bars.value[index]) {
          bars.value[index] = {
            ...targetBars.value[index],
            size: 0,
            value: 0
          }
        }
        // 逐步将 bars.value[index]的 size 和 value 值逐步变化到 targetBars.value[index]的 size 和 value
        gsap.to(bars.value[index], {
          duration: 0.5,
          ...targetBars.value[index]
          // size: targetBars.value[index].size,
          // value: targetBars.value[index].value
        })
      }
    }, {
      deep: true
    })
  return {
    bars
  }
}