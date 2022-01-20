import React from 'react';
import axios from 'util/axiosConfig';
// import { withStyles } from '@material-ui/core/styles';
// import Dialog from '@material-ui/core/Dialog';
// import MuiDialogTitle from '@material-ui/core/DialogTitle';
// import MuiDialogContent from '@material-ui/core/DialogContent';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import Typography from '@material-ui/core/Typography';
import LiveFeed from 'components/LiveFeed/index';
import { Spinner, Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'
import "bootstrap/dist/css/bootstrap.min.css";

// const styles = (theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(2),
//   },
//   closeButton: {
//     position: 'absolute',
//     right: theme.spacing(1),
//     top: theme.spacing(1),
//     color: theme.palette.grey[500],
//   },
// });

// const DialogTitle = withStyles(styles)((props) => {
//   const { children, classes, onClose, ...other } = props;
//   return (
//     <MuiDialogTitle disableTypography className={classes.root} {...other}>
//       <Typography variant="h6">{children}</Typography>
//       {onClose ? (
//         <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </MuiDialogTitle>
//   );
// });

// const DialogContent = withStyles((theme) => ({
//   root: {
//     padding: theme.spacing(2),
//   },
// }))(MuiDialogContent);

export default function ListDevicesPage() {
  // const [open, setOpen] = React.useState(false);
  const [devices, setDevices] = React.useState(null);
  const [showLiveFeed, setShowLiveFeed] = React.useState(false);
  const [liveFeedDevice, setLiveFeedDevice] = React.useState(null);

  React.useEffect(() => {
    console.log("getting devices...")
    axios.get('/api/devices').then((res) => {
        console.log(res);
        setDevices(res.data);
        console.log(devices);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLiveFeed])

  const handleShowLiveFeed = (device) => {
    setShowLiveFeed(true);
    setLiveFeedDevice(device);
  }

  const deleteDevice = (id) => {
    axios.delete(`/api/devices/${id}`).then(() => {
      setDevices(null);
      axios.get('/api/devices').then((res) => {
        console.log(res);
        setDevices(res.data);
        console.log(devices);
      });
    });
  }

  const mapDeviceToTableRow = (device) => (
    <tr key={device.id}>
      <td className="align-middle">
        {device.location}
      </td>
      <td className="align-middle">
        {device.stream_name}
      </td>
      <td className="text-end align-middle">
        <Button className="w-100" color="primary" onClick={() => handleShowLiveFeed(device)}>
          Live View
        </Button>
      </td>
      <td className="text-end align-middle" >
        <Button className="mx-1 w-100" tag={Link} to={{
          pathname: `/devicemanager/${device.id}/edit`,
          state: {
            device: device
          }
        }}>
          Edit
        </Button>
      </td>
      <td className="text-end align-middle">
        <Button color="danger" onClick={() => deleteDevice(device.id)} className="w-100">
          Delete
        </Button>
      </td>
      
    </tr> 
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pb-4">
        <h1 className="fw-bold">Device Manager</h1>
        <Button tag={Link} to="/devicemanager/add" color="primary" className="h" >
          Add Device
        </Button>
      </div>
      {
        devices ? (
          <div>
            <Table striped borderless responsive>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Stream Name</th>
                  <th />
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody className="border-top border-bottom">
                {devices.map(mapDeviceToTableRow)}
              </tbody>
            </Table>
            <Modal show={showLiveFeed} size="lg" onHide={() => setShowLiveFeed(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{liveFeedDevice? liveFeedDevice.stream_name : ""}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <LiveFeed url={liveFeedDevice? liveFeedDevice.stream_url : null}></LiveFeed>
              </Modal.Body>
            </Modal>
          </div>
          
        ) : (
          <Spinner />
        )
      }
    </div>
  )
}