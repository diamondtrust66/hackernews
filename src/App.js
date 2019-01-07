import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '100';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);

      this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      hits: [],
      isLoading: false,
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  onDismiss(id) {
    function isNotId(item) {
      return item.objectID !== id;
    }

    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({
      result: Object.assign({}, this.state.result, {hits: updatedList})
    });
  }

  onSearchChange(event) {
    console.log("OnSearchChange() was called.");
    this.setState({searchTerm: event.target.value});
    this.onSearchSubmit(event.target.value);
  }

  setSearchTopStories(result) {
    const {hits, page} = result;

    const oldHits = page !== 0
      ? this.state.result.hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      result: {hits:updatedHits, page}
    });
  }

  onSearchSubmit(event) {
    console.log("Search Term was submitted.");
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    //event.preventDefault();
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .then(result => this.setState({isLoading: false}))
      .catch(error => error);
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({isLoading: true});

    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const siteName = "HackerNews";
    const tagLine = "We'll stop writing it when you stop reading it!";
    const helloWorld = "Welcome To HackerNews!";

    const {searchTerm, result, isLoading} = this.state;
    const page = (result && result.page) || 0;

    if(isLoading) {
      return <p>Loading...</p>;
    }

    if(!result) {
      return null;
    }

    let user = {
      firstName: 'Trust',
      lastName: 'Birungi',
    };

    return (
      <div className="page">
        <h1>{siteName}</h1>
        <h1>||</h1>
        <h2>{tagLine}</h2>
        <h2>{user.firstName + ' ' + user.lastName}, {helloWorld}</h2>
        <br /><br />
        <ErrorBoundary>
          <div className="interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
              onSubmit = {this.onSearchSubmit}
            >
              Search
            </Search>
          </div>
          <div className="more">
            <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
              More
            </Button>
          </div>

          <br /><br />
          <div className="Table">
          { result &&
             <Table
              list={result.hits}
              onDismiss={this.onDismiss}
            />
          }
          </div>
          </ErrorBoundary>
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const {value, onChange, onSubmit, children} = this.props;
    return(
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

class Table extends Component {
  render() {
    const {list, onDismiss} = this.props;
    return(
      <div className="table">
        {list.map(item =>
          <div key={item.objectID} className="table-row">
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
                  className=""
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

//An error boundary to provide a fallback UI in case a component fails instead of crashing the entire app
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
  }

  render(){
    if(this.state.hasError) {
      return <h1>Oops! Something went wrong. We are working relentlessly to fix it!</h1>
    }
    return this.props.children;
  }
}

export default App;
