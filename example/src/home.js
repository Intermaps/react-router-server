import React, { Component, PropTypes } from 'react';
import { fetchProps } from 'react-router-server';

@fetchProps(
  state => ({
    isLoaded: state.message,
    message: state.message
  }),
  actions => ({ done: actions.done })
)
class Home extends Component {
  componentWillMount() {
    if (!this.props.isLoaded) {
      // Async data loading
      setTimeout(() => {
        this.props.done({ message: 'I am ready to be displayed' });
      }, 5);
    }
  }

  render() {
    const { message } = this.props;
    return (
      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid gray' }}>
        {message}
      </div>
    );
  }
}

export default Home;
