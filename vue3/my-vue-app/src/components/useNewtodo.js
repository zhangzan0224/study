import {
  ref
} from 'vue'
import {
  generateUUID
} from '../utils'
export default function useNewTodo(todosRef) {
  const newTodoRef = ref('')
  const addTodo = () => {
    const value = newTodoRef.value && newTodoRef.value.trim()
    if (!value) return
    const newtodo = {
      id: generateUUID(),
      title: value,
      isFinshed: false
    }
    todosRef.value.push(newtodo)
    
    newTodoRef.value = ''
  }
  return {
    newTodoRef,
    addTodo
  }
}