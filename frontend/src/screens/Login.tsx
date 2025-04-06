import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import RegisterModal from "../components/RegisterModal";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

function FormFloatingBasicExample({
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    console.log("Logging in with:", { username, password });

    try {
      // Send plain password to the server - it will handle hashing/verification
      const response = await fetch(
        "https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/User/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Username: username,
            Password: password,
          }),
        }
      );

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      // Process successful login
      const data = await response.json();

      // Store user info (don't store the password!)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        })
      );

      // Redirect to dashboard/home
      navigate("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

            <FormFloatingBasicExample
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleLogin}
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
