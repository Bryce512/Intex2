import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import RegisterModal from "../components/registerModal";

function FormFloatingBasicExample() {
  return (
    <>
      <FloatingLabel
        controlId="floatingInput"
        label="Email address"
        className="mb-3"
      >
        <Form.Control type="email" placeholder="name@example.com" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Password">
        <Form.Control type="password" placeholder="Password" />
      </FloatingLabel>
      <br />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </>
  );
}

function Login() {
  const [modalShow, setModalShow] = useState(false);
  const [validated, setValidated] = useState(false);


  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Login</h2>
            <FormFloatingBasicExample />
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

export default Login
