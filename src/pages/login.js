import { Dropdown, DropdownButton } from "react-bootstrap";
import { useState } from "react";
import { userSignin } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showSignUp, setshowSignUp] = useState(false);
  const [userType, setuserType] = useState("CUSTOMER");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const updateSignupData = (e) => {
    if (e.target.id === "userid") {
      setUserId(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  };

  const signupFn = () => {
    console.log("Sign up button triggered");
  };

  const loginFn = (e) => {
    e.preventDefault();
    const data = {
      userId: userId,
      password: password,
    };
    userSignin(data)
      .then((response) => {
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("userTypes", response.data.userTypes);
        localStorage.setItem("userStatus", response.data.userStatus);
        localStorage.setItem("token", response.data.accessToken);
        if (response.data.userTypes === "CUSTOMER") navigate("/customer");
        else if (response.data.userTypes === "ENGINEER") navigate("/engineer");
        else if (response.data.userTypes === "ADMIN") navigate("/admin");
        else navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message);
      });
  };

  const toggleSignUp = () => {
    setshowSignUp(!showSignUp);
  };
  const handleSelect = (e) => {
    setuserType(e);
  };

  return (
    <div className="bg-info d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-3 rounded-4 shadow-lg"
        style={{ width: 20 + "rem" }}
      >
        <h4 className="text-center text-info">
          {showSignUp ? "SignUp" : "Signin"}
        </h4>
        <form onSubmit={showSignUp ? signupFn : loginFn}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              m-1
              placeholder="User Id"
              value={userId}
              onChange={updateSignupData}
              id="userid"
            ></input>
          </div>

          {showSignUp && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  m-1
                  placeholder="User name"
                ></input>
              </div>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="E-mail"
                ></input>
              </div>
              <div className="d-flex justify-content-between m-1">
                <span className="my-1">User Type</span>
                <DropdownButton
                  align="end"
                  title={userType}
                  id="userType"
                  varient="light"
                  onSelect={handleSelect}
                >
                  <Dropdown.Item eventKey="CUSTOMER">CUSTOMER</Dropdown.Item>
                  <Dropdown.Item eventKey="ENGINEER">ENGINEER</Dropdown.Item>
                </DropdownButton>
              </div>
            </>
          )}
          <div className="input-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={updateSignupData}
              id="password"
            ></input>
          </div>
          <div className="input-group">
            <input
              type="submit"
              className="btn btn-info fw-bolder m-1 text-white form-control"
              value={showSignUp ? "SignUp" : "Sigin"}
            ></input>
          </div>

          <div
            className="m-1 text-center text-primary clickable"
            onClick={toggleSignUp}
          >
            {showSignUp
              ? "Already have an account? Signin"
              : "Don't have an account? Sign Up"}
          </div>
          <div className="text-center text-danger">{message}</div>
        </form>
      </div>
    </div>
  );
}
export default Login;
