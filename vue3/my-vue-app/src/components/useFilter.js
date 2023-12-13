import {
  ref,
  onMounted,
  onUnmounted,
  computed
} from 'vue';

const validHash = {
  all: true,
  active: true,
  completed: true
}

import {
  filter
} from '../utils/todoStorage'
export default function (todosRef) {
  const visibilityRef = ref('all')
  // 组件挂在完成的生命周期函数
  const onhashChange = () => {
    const visibility = window.location.hash.replace(/#\/?/, '')
    if (visibility in validHash) {
      visibilityRef.value = visibility
    } else {
      window.location.hash = ''
      visibilityRef.value = 'all'
    }
  }
  const filterTodosRef = computed(() => {
    return filter(todosRef.value, visibilityRef.value)
  })
  const remainingRef = computed(() => {
    return filter(todosRef.value, 'active').length
  })
  const finishedRef = computed(() => {
    return filter(todosRef.value, 'completed').length
  })
  onMounted(() => {
    window.addEventListener('hashchange', onhashChange)
  })
  // 组件销毁的时候的生命周期函数
  onUnmounted(() => {
    window.removeEventListener('hashchange', onhashChange)
  })
  return {
    visibilityRef,
    filterTodosRef,
    remainingRef,
    finishedRef
  }
}