import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";

function FormExample({
  validated,
  setValidated,
  onRegister,
  loading,
  errorMessage,
  failedAttempts,
}: {
  validated: boolean;
  setValidated: React.Dispatch<React.SetStateAction<boolean>>;
  onRegister: (userData: any) => void;
  loading: boolean;
  errorMessage: string;
  failedAttempts: number;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const isRateLimited = failedAttempts >= 5;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    if (isRateLimited) {
      return; // Don't proceed if rate limited
    }

    // Create user object and call the registration function
    const userData = {
      // Make sure these property names match EXACTLY what's in your C# User model
      Username: username, // Verify if it's Username with capital 'U'
      Password: password,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
    };

    onRegister(userData);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {isRateLimited && (
        <Alert variant="danger">
          Too many failed registration attempts. Please try again later.
        </Alert>
      )}

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isRateLimited || loading}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isRateLimited || loading}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustomUsername">
          <Form.Label>Username</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isRateLimited || loading}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isRateLimited || loading}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isRateLimited || loading}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          disabled={isRateLimited || loading}
        />
      </Form.Group>
      <Button type="submit" disabled={isRateLimited || loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
}

interface RegisterModalProps {
  show: boolean;
  onHide: () => void;
  validated: boolean;
  setValidated: React.Dispatch<React.SetStateAction<boolean>>;
}

function RegisterModal({
  show,
  onHide,
  validated,
  setValidated,
}: RegisterModalProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

const handleRegister = async (userData: JSON) => {
  setLoading(true);
  setErrorMessage("");

  console.log("Registering user:", userData);

  try {
    const response = await fetch("https://localhost:5000/User/AddUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });


    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      console.log("JSON Response:", data);
    } else {
      // Not JSON, get as text instead
      const textResponse = await response.text();
      console.log(
        "Text Response (first 200 chars):",
        textResponse.substring(0, 200)
      );
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      throw new Error(data?.message || `Server error: ${response.status}`);
    }

    // Registration successful
    console.log("Registration successful:", data);

    // Reset validation state and close modal
    setValidated(false);
    onHide();

    // You might want to automatically log the user in here
    // or show a success message
    alert("Registration successful! Please log in.");
  } catch (error: any) {
    // Increment failed attempts counter
    setFailedAttempts((prev) => prev + 1);

    // Set error message
    setErrorMessage(error.message || "Registration failed. Please try again.");

    console.error("Registration error:", error);
  } finally {
    setLoading(false);
  }
};

  // Reset error message and loading state when modal is closed
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
        <FormExample
          validated={validated}
          setValidated={setValidated}
          onRegister={handleRegister}
          loading={loading}
          errorMessage={errorMessage}
          failedAttempts={failedAttempts}
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
