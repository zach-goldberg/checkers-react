import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CheckersBoard from './components/CheckersBoard';
import CheckersToolbar from './components/CheckersToolbar';
import './App.css';

function App() {

  const initialState = {
    team1Perspective: true
  };

  const [state, dispatch] = React.useReducer(handleDispatch, initialState);

  return (
    <div className="checkers-app">
      <Container>
        <Row>
          <Col><h1>Checkers</h1></Col>
        </Row>
        <Row>
          <Col><CheckersBoard team1Perspective={state.team1Perspective} /></Col>
        </Row>
        <Row>
          <Col><CheckersToolbar dispatch={dispatch} /></Col>
        </Row>
      </Container>
    </div>
  );
}

function handleDispatch(state, action) {
  switch (action.type) {
    case 'TOGGLE_PERSPECTIVE':
      return { team1Perspective: !state.team1Perspective };
    default:
      throw new Error('unknown action');
  }
}

export default App;
