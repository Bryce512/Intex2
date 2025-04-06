import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import RegisterForm from "./RegisterForm";


interface RegisterModalProps {
  show: boolean;
  validated: boolean;
  setValidated: React.Dispatch<React.SetStateAction<boolean>>;
  onHide: () => void;
}

function RegisterModal({
  show,
  validated,
  setValidated,
  onHide,

}: RegisterModalProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const handleClose = () => {
      setErrorMessage("");
      setLoading(false);
      onHide();
    };

  return (
    
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Registration
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Create Your Account</h4>
        <RegisterForm
          validated={validated}
          setValidated={setValidated}
          loading={loading}
          errorMessage={errorMessage}
          failedAttempts={failedAttempts}
          setErrorMessage={setErrorMessage}
          setLoading={setLoading}
          setFailedAttempts={setFailedAttempts}
          handleClose={handleClose}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} disabled={loading}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RegisterModal;
