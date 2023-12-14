<template>
  <div id="app" data-v-app="">
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          autofocus=""
          autocomplete="off"
          placeholder="What needs to be done?"
          v-model="newTodoRef"
          @keyup.enter="addTodo"
        />
      </header>
      <section class="main" v-show="todosRef.length > 0">
        <input id="toggle-all" class="toggle-all" type="checkbox" :checked="isAllFinished" @input="changeAllStatus($event.target.checked)"/>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list" v-for="todo in filterTodosRef" :key="todo.id">
          <li class="todo" :class="{ completed: todo.isFinshed, editing: todo === editTodoRef}">
            <div class="view">
              <input class="toggle" type="checkbox" v-model="todo.isFinshed"/>
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <button class="destroy" @click="removeTodo(todo)"></button>
            </div>
            <input class="edit" type="text" v-model="todo.title"  @keyup.escape="cancelEdit(todo)" @keyup.enter="saveEdit(todo)" />
          </li>
          <!-- <li class="todo">
            <div class="view">
              <input class="toggle" type="checkbox" />
              <label>投递50封简历</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" type="text" />
          </li>
          <li class="todo">
            <div class="view">
              <input class="toggle" type="checkbox" />
              <label>上午10:30 参加面试</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" type="text" />
          </li> -->
        </ul>
      </section>
      <footer class="footer" v-show="todosRef.length > 0">
        <span class="todo-count">
          <strong>{{ remainingRef }}</strong>
          <span>item{{ remainingRef === 1 ? '' : 's'}} left</span>
        </span>
        <ul class="filters">
          <li><a href="#/all" :class="{selected: visibilityRef === 'all'}">All</a></li>
          <li><a href="#/active" :class="{selected: visibilityRef === 'active'}">Active</a></li>
          <li><a href="#/completed" :class="{selected: visibilityRef === 'completed'}">Completed</a></li>
        </ul>
        <button class="clear-completed" v-show="finishedRef > 0" @click="clearCompleted">
          Clear completed
        </button>
      </footer>
    </section>
  </div>
</template>

<script>
import useTodoList from './components/useTodoList'
import useNewtodo from './components/useNewtodo'
import useFilter from './components/useFilter'
import useEditTodo from './components/useEditTodo'
import useDeleteTodo from './components/useDeleteTodo'
  export default {
    setup(props, context) {
      const  { todosRef } = useTodoList()
      return {
        todosRef,
        ...useNewtodo(todosRef),
        ...useFilter(todosRef),
        ...useEditTodo(todosRef),
        ...useDeleteTodo(todosRef)
      }
    }
  }
</script>
