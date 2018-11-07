import React, { Component } from 'react';
import Player from './Player/Player';

class App extends Component {
  render() {
    return (
      <div style={{ height: '100vh' }}>
        <Player src="https://www.youtube.com/watch?v=9cBN9_9oK4A"/>
      </div>
    );
  }
}

export default App;
