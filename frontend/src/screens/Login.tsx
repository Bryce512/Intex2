import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import RegisterModal from "../components/RegisterModal";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../api/UsersAPI";



function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  loading,
}: {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) {
  return (
    <Form onSubmit={handleSubmit}>
      <FloatingLabel
        controlId="floatingInput"
        label="Username"
        className="mb-3"
      >
        <Form.Control
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Password">
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FloatingLabel>
      <br />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </Form>
  );
}

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [validated, setValidated] = useState(false);


  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Login</h2>

            {errorMessage && (
              <Alert
                variant="danger"
                onClose={() => setErrorMessage("")}
                dismissible
              >
                {errorMessage}
              </Alert>
            )}

            <LoginForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleSubmit={(e) => {
                e.preventDefault();
                handleLogin(
                  e,
                  setErrorMessage,
                  setLoading,
                  username,
                  password,
                  navigate
                );
              }}
              loading={loading}
            />
            <br />
            <p>
              Don't have an account?{" "}
              <a className="btn btn-link" onClick={() => setModalShow(true)}>
                Sign Up
              </a>
            </p>

            {modalShow && (
              <RegisterModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                validated={validated}
                setValidated={setValidated}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;