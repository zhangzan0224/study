import {ref} from 'vue'
export default function useEditTodo (todosRef) {
  const editTodoRef = ref(null)
  let tempTitle = null
  const editTodo = (todo) => {
    editTodoRef.value = todo
    tempTitle = todo.title

  }
  const saveEdit = (todo) => {
    editTodoRef.value = null;
    const title = todo.title.trim()
    if(title) {
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
  return {
    editTodoRef,
    editTodo,
    saveEdit,
    cancelEdit
  }
}