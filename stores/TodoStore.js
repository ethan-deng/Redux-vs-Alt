import alt from '../alt'
import TodoActions from './TodoActions'

class TodoStore {
  constructor() {
    this.bindActions(TodoActions)
    this.todos = []
    this.nextTodoId = 0
    this.currFilter = 'SHOW_ALL'
  }

  onAddTodo(text){
    this.todos.push({
      id: this.nextTodoId++,
      text: text,
      completed: false
    })
  }

  onToggleTodo(id){
    for (let i=0; i < this.todos.length; i++){
      if (i === id){
        this.todos[i].completed = !this.todos[i].completed;
      }
    }
  }

  onSetVisibilityFilter(filter){
    this.currFilter = filter
  }
}

module.exports = alt.createStore(TodoStore, 'TodoStore');
