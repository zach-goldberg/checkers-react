import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CheckersToolbar({ dispatch }) {
  return (
    <Row>
      <Col>
        <Button variant="primary" onClick={() => dispatch({ type: 'TOGGLE_PERSPECTIVE' })}>
          Change Perspective
        </Button>
      </Col>
    </Row>
  );
}

export default CheckersToolbar;