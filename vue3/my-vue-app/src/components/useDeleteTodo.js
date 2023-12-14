export default function (todosRef) {
  // 删除todo
  const removeTodo = (todo) => {
    todosRef.value.splice(todosRef.value.indexOf(todo), 1)
  }
  const clearCompleted = () => {
    todosRef.value = todosRef.value.filter(todo => !todo.isFinshed)
  }
  return {
    removeTodo,
    clearCompleted
  }
}