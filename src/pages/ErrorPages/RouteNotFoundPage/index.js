import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export default function RouteNotFoundPage() {
  return (
    <div>
      <h1>
        Looks like this page doesn&apos;t exist at the moment.
      </h1>
      <Button tag={Link} to="/" color="primary">
        Take me home
      </Button>
    </div>
  )
}
