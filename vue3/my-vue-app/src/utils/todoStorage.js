/**
 * Fetches data from local storage and parses it as JSON.
 *
 * @return {array} The parsed data from local storage.
 */
const LOCAL_KEY = 'todomvc'
export function fetch() {
  return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
}
/**
 * Saves the given todos to the local storage.
 *
 * @param {Array} todos - The todos to be saved.
 * @return {undefined} - This function does not return any value.
 */
export function save(todos) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(todos))
}


/**
 * Filters an array of todos based on the specified visibility.
 *
 * @param {Array} todos - The array of todos to filter.
 * @param {string} visibility - The visibility option to filter the todos by.
 * @return {Array} The filtered array of todos.
 */
export function filter(todos, visibility) {
  switch (visibility) {
    case 'active':
      return todos.filter(todo => !todo.isFinshed)
    case 'completed':
      return todos.filter(todo => todo.isFinshed)
    default:
      return todos
  }
}