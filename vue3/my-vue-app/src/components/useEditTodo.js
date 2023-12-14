import {
  ref,
  computed
} from 'vue'
export default function useEditTodo(todosRef) {
  const editTodoRef = ref(null)
  let tempTitle = null
  const editTodo = (todo) => {
    editTodoRef.value = todo
    tempTitle = todo.title

  }
  const saveEdit = (todo) => {
    editTodoRef.value = null;
    const title = todo.title.trim()
    if (title) {
      todo.title = title
    } else {
      const index = todosRef.value.indexOf(todo)
      if (index >= 0) {
        todosRef.value.splice(index, 1)
      }
    }
  }
  const cancelEdit = (todo) => {
    editTodoRef.value = null;
    todo.title = tempTitle;
  }
  // 计算属性,是否全部完成
  const isAllFinished = computed(() => {
    return todosRef.value.every(todo => todo.isFinshed)
  })
  // 设置全部完成或者全部未完成
  const changeAllStatus = (checked) => {
    todosRef.value.forEach(to => to.isFinshed = checked)
  }
  // 删除todo
  const removeTodo = (todo) => {
    todosRef.value.splice(todosRef.value.indexOf(todo), 1)
  }
  return {
    editTodoRef,
    editTodo,
    saveEdit,
    cancelEdit,
    isAllFinished,
    changeAllStatus,
    removeTodo
  }
}