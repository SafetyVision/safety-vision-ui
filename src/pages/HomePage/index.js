import { Button, Row, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="mx-auto ">
            SafetyVision
          </h1>
          <p>
            A safety infraction monitoring and alerting platform.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button tag={Link} to="/signup" color="primary" >
            Create Account
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button tag={Link} to="/login" className="mt-2">
            Log In
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
