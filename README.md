# Redux-vs-Alt
A line by line comparison of Redux and Alt's implementation of Dan Abramov's Todo list example

Redux is getting hot! The trend can be seen from this (Redex vs Alt NPM trend chart)[http://www.npmtrends.com/redux-vs-alt]. However the framework of (Alt + AltContainer)[http://alt.js.org/] is a much more concise and much more easier than Redux.

It seems Alt is not getting as much attention as Redux. There may be few reasons for this. First, the best coding approach of Alt + AltContainer is not well documented. Second, even though Alt came out earlier than Redux or AltContainer is a few month later than Redux. Third, the fame of Dan Abramov, the author of both React Hot Loader and Redux.

If you haven't heard of Alt, please read along and see why I think Alt is much easier than Redux. This is line by line comparison of Dan Abramove's Todo list demo for Redux and my port of the Todo list to Alt implementation.

## Actions

### Alt
```javascript
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
