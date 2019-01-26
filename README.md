# Redux-vs-Alt
A line by line comparison of Redux and Alt's implementation of Dan Abramov's Todo list example

Redux is getting hot! The trend can be seen from this [Redux vs Alt NPM trend chart](http://www.npmtrends.com/redux-vs-alt). However the framework of [Alt + AltContainer](http://alt.js.org/) is a much more concise and much easier to understand than Redux.

It seems Alt is not getting as much attention as Redux. There may be a few reasons for this. First, the best coding approach of Alt + AltContainer is not well documented. Second, even though Alt came out earlier than Redux but AltContainer is a few months later than Redux. Third, Dan Abramov the author of both React Hot Loader and Redux is a better known figure.

If you haven't heard of Alt, please read along and see why I think Alt is much easier than Redux. This is a line by line comparison of Dan Abramove's Todo list demo for Redux and my porting of the Todo list to Alt implementation.

To run the sample code

```
npm install
npm start
open http://localhost:3000/
```

## Actions

### Alt
```javascript
import alt from '../alt'

module.exports =  alt.generateActions('addTodo', 'toggleTodo', 'setVisibilityFilter');
```

### Redux
```javascript
let nextTodoId = 0
export const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  }
}

export const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}

export const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}
```
As you can see Alt action is very simple, all it needs is a string as the name of the action such as "addTodo". Whenever you need a new action, you just need to add a new name to the generateActions. On the contrast, with Redux you have to define a new function and think about what parameters it needs. it is one line of code in Alt vs at least 5 lines of code in Redux.

## Stores/Reducer

### Alt
```javascript
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
```

### Redux
```javascript
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state
      }

      return Object.assign({}, state, {
        completed: !state.completed
      })
    default:
      return state
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ]
    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      )
    default:
      return state
  }
}

export default todos
```

In Alt, state is just defined as the properties of the class in constructor. The action handlers is just the methods of the class. It is very straight forward and nicer synx than the switch statement of Reducer in Redux. In Alt the convention is to just implement a function with name "onAddTodo" to handle the action "addTodo".

Another important note about Reducer is that it forces the state to be immutable and a copy of the state must be returned from the reducer. There will be performance penalties when the state is large such as a very long array. In Alt you can either make a copy of the state in action hander or you can change the state object in place as I did

in Alt store
```javascript
  onAddTodo(text){
    this.todos.push({
      id: this.nextTodoId++,
      text: text,
      completed: false
    })
  }
```

vs Redux's

```javascript
  case 'ADD_TODO':
    return [
      ...state,
      todo(undefined, action)
    ]
```

## Container/Provider

### Alt
```javascript
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
```

### Redux
```javascript
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

```

```javascript
import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App
```

The AltContainer looks similar to Redux's Provider. However that is all you need to do in Alt to wire views, actions, and stores. In Redux you have to do many more manual wirings.

#### Redux wirings

```javascript
AddTodo = connect()(AddTodo)
```

```javascript
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)

export default FilterLink
```

```javascript
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList

```

As you can see in Redux, you have to call "connect", create "mapStateToProps", "mapDispatchToProps" to wire views to actions and stores. In Alt, all you have to do is

```
<AltContainer stores = {{store: TodoStore}} actions = {{actions: TodoActions}}>
```

Alt takes care of all the wirings in the background.

## View and Dispatch

### Alt

```javascript
import React from 'react'

let AddTodo = (props) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        props.actions.addTodo(input.value)
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}

export default AddTodo
```

### Redux
```javascript
import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(addTodo(input.value))
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
AddTodo = connect()(AddTodo)

export default AddTodo
```

Alt and Redux is similar in dispatching actions from views but Alt is more straight forward by using a function call
```
props.actions.addTodo(input.value)
```

Redux is more mind-boggling
```
dispatch(addTodo(input.value))
```
