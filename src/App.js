import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

      this.state = {
      list: list,
      searchTerm: "",
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    function isNotId(item) {
      return item.objectID !== id;
    }

    const updatedList = this.state.list.filter(isNotId);
    this.setState({list: updatedList});
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  render() {
    const siteName = "HackerNews";
    const tagLine = "We'll stop writing it when you stop reading it!";
    const helloWorld = "Welcome To HackerNews!";

    const {searchTerm, list} = this.state;

    let user = {
      firstName: 'Trust',
      lastName: 'Birungi',
    };

    return (
      <div className="App">
        <h1>{siteName}</h1>
        <h1>||</h1>
        <h2>{tagLine}</h2>
        <h2>{user.firstName + ' ' + user.lastName}, {helloWorld}</h2>
        <br /><br />

        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          Search
        </Search>

        <br /><br />

        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const {value, onChange, children} = this.props;
    return(
      <form>
        {children} <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>
    );
  }
}

class Table extends Component {
  render() {
    const {list, pattern, onDismiss} = this.props;
    return(
      <div>
        {list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{' ' + item.author}</span>
              <span>{' ' + item.num_comments}</span>
              <span>{' ' + item.points}</span>
              <span>
                <Button
                  onClick = {() => onDismiss(item.objectID)}
                  type = "Button"
                >
                  Dismiss
                </Button>
              </span>
            </div>
        )}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const {
      onClick,
      className = "",
      children,
    } = this.props;

    return(
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  }
}

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

export default App;
