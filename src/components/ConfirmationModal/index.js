import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export default function ConfirmationModal({ isOpen, toggle, bodyContent, confirmAction }){
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>
        Are you sure you want to do this?
      </ModalHeader>
      <ModalBody>
        {bodyContent}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={confirmAction}>
          Yes, I'm sure
        </Button>
        <Button onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
