import { ArrowLeftCircleFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export default function BackButton({ to, text }) {
  return (
    <Button tag={Link} to={to} className="d-flex justify-content-between align-items-center mb-4 px-3" style={{ width: '100px' }}>
      <ArrowLeftCircleFill />
      <span>
        {text}
      </span>
    </Button>
  );
}
