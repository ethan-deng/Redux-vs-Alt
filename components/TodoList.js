import React, { PropTypes } from 'react'
import Todo from './Todo'

const TodoList = (props) => {
  let visibleTodos = null
  let todos = props.store.todos;
  switch (props.store.currFilter) {
    case 'SHOW_ALL':
      visibleTodos = todos
      break
    case 'SHOW_COMPLETED':
      visibleTodos = todos.filter(t => t.completed)
      break
    case 'SHOW_ACTIVE':
      visibleTodos = todos.filter(t => !t.completed)
      break
  }

  return (<ul>
    {visibleTodos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => props.actions.toggleTodo(todo.id)}
      />
    )}
  </ul>)
}

TodoList.propTypes = {
  store: PropTypes.object,
  actions: PropTypes.object
}

export default TodoList
