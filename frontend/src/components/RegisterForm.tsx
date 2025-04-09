import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { handleSubmit } from "../api/moviesAPI";

function RegisterForm({
  validated,
  setValidated,
  loading,
  errorMessage,
  failedAttempts,
  setErrorMessage,
  setLoading,
  setFailedAttempts,
  handleClose,
}: {
  validated: boolean;
  setValidated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  errorMessage: string;
  failedAttempts: number;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFailedAttempts: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
}) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const isRateLimited = failedAttempts >= 5;

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={(e) =>
        handleSubmit(
          e,
          setValidated,
          isRateLimited,
          username,
          password,
          email,
          name,
          setErrorMessage,
          setLoading,
          setFailedAttempts,
          handleClose
        )
      }
    >
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {isRateLimited && (
        <Alert variant="danger">
          Too many failed registration attempts. Please try again later.
        </Alert>
      )}

      <Row classname="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isRateLimited || loading}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isRateLimited || loading}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row classname="mb-3">
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
      <Row classname="mb-3">
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


export default RegisterForm;