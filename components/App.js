import React from 'react'
import AltContainer from 'alt-container'
import TodoActions from '../stores/TodoActions.js'
import TodoStore from '../stores/TodoStore.js'
import Footer from './Footer'
import AddTodo from './AddTodo'
import TodoList from './TodoList'

const App = () => (
  <div>
    <AltContainer stores = {{store: TodoStore}} actions = {{actions: TodoActions}}>
      <AddTodo />
      <TodoList />
      <Footer />
    </AltContainer>
  </div>
)

export default App
