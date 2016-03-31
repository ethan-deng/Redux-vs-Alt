import alt from '../alt'

class TodoActions {
  constructor() {
    this.generateActions(
      'addTodo',
      'toggleTodo',
      'setVisibilityFilter'
    )
  }
}

module.exports = alt.createActions(TodoActions)
