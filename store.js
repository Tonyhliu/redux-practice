import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
// const React = require('react');
// const React = require('react');
// const createStore = require('redux').createStore;

// one state
var defaultState = {
  todo: {
    items: []
  }
};

// actions
function addTodo(message) {
  return {
    type: 'ADD_TODO',
    message: message,
    completed: false
  };
}

function completeTodo(index) {
  return {
    type: 'COMPLETE_TODO',
    index: index
  };
}

function deleteTodo(index) {
  return {
    type: 'DELETE_TODO',
    index: index
  };
}

function clearTodo() {
  return {
    type: 'CLEAR_TODO'
  };
}


// REDUCER 
function todoApp(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      var newState = Object.assign({}, state);

      newState.todo.items.push({
        message: action.message,
        completed: false
      });

      return newState;
    case 'COMPLETE_TODO':
       var newState = Object.assign({}, state);

       newState.todo.items[action.index].completed = true;

       return newState;

    case 'DELETE_TODO':
      //  var items = [].concat(state.todo.items);
       var items = Array.prototype.slice.call(state.todo.items);

       items.splice(action.index, 1);

       return Object.assign({}, state, {
         todo: {
           items: items
         }
       });

    case 'CLEAR_TODO':
       return Object.assign({}, state, {
         todo: {
           items: []
         }
       });

    default:
      return state;
  }
}

// store (takes 3 args, 1: reducer[function],
// 2: preloaded state [the initial state],
// 3: enhancer[function, store enhancer,
// third-party capabilities such as middleware,
// time travel, persistence, etc. Only one that
// ships with Redux is applyMiddleware()])
var store = createStore(todoApp, defaultState);
// var store = redux.createStore(todoApp, defaultState);


// components
class AddTodoForm extends React.Component {
  state = {
    message: ''
  };

  onFormSubmit(e) {
    e.preventDefault();
    store.dispatch(addTodo(this.state.message));
    this.setState({ message: '' });
  }

  onMessageChanged(e) {
    var message = e.target.value;
    this.setState({ message: message });
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit.bind(this)}>
        <input type="text"
              placeholder="Todo..."
              onChange={this.onMessageChanged.bind(this)}
              value={this.state.message} />
        <input type="submit"
                value="Add" />
      </form>
    );
  }
}

class TodoItem extends React.Component {
  onDeleteClick() {
    store.dispatch(deleteTodo(this.props.index));
  }

  onCompletedClick() {
    store.dispatch(completeTodo(this.props.index));
  }

  render() {
    return (
      <li>
        <a href="#"
          onClick={this.onCompletedClick.bind(this)}
          style={{textDecoration: this.props.completed ? 'line-through' : 'none'}}>
          {this.props.message.trim()}
        </a> 
        <a href="#"
            onClick={this.onDeleteClick.bind(this)}
            style={{textDecoration: 'none'}}>
            [x]
        </a>
      </li>
    );
  }
}

class TodoList extends React.Component {
  state = {
    items: []
  };

  componentWillMount() {
    store.subscribe(() => {
      var state = store.getState();
      this.setState({
        items: state.todo.items
      });
    });
  }

  render() {
    var items = [];

    this.state.items.forEach((item, index) => {
      items.push(<TodoItem
        key={index}
        index={index}
        message={item.message}
        completed={item.completed}
      />);
    });

    if (!items.length) {
      return (
        <p>
          <i>Please add something to do.</i>
        </p>
      );
    }

    return (
      <ol>{ items }</ol>
    );
  }
}

// ReactDOM render
ReactDOM.render(
  <div>
    <h1>Todo</h1>
    <AddTodoForm />
    <TodoList />
  </div>,
  document.getElementById('container')
);
