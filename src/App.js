import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import firebaseConfig from './Firebase/firebase.config';
initializeApp(firebaseConfig);
const auth = getAuth();

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  const handleRegistration = event => {
    event.preventDefault();
    if (password.length < 8) {
      setError("Your password must be at least 8 characters");
      return;
    }
    if (password.search(/[a-z]/i) < 0) {
      setError("Your password must contain at least one letter.");
      return;
    }
    if (password.search(/[0-9]/) < 0) {
      setError("Your password must contain at least one digit.");
      return;
    }
    isLogin ? signInUser(email, password) : createNewUser(email, password)
  }

  const signInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSuccessMessage('Signed in successfully.')
        setError('')
      })
      .catch((error) => {
        setError(`Your entered username & password doesn't match`)
      });
  }
  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSuccessMessage('Registration successful.')
        setError('');
        verifyEmail();
      })
      .catch((error) => {
        setError(`${error.message}`)
        setSuccessMessage('')
      });
  }
  const toggleLogin = e => {
    setIsLogin(e.target.checked)
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      setSuccessMessage(`Check your mail / spam box for verification.`)
    });
  }

  const handleResetPassword = (event) => {
    sendPasswordResetEmail(auth, email).then(result => {
      setSuccessMessage(`Check your mail / spam box for verification.`)
      setError('');
    })
  }

  return (
    <div className="row">
      <div className="col-md-6 m-auto">
        <h1>Please {isLogin ? "Sign In" : "Register"} Here.</h1>
        <form onSubmit={handleRegistration}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input onBlur={handleEmailChange} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="exampleInputPassword1" required />
          </div>
          <h6 className="text-danger">{error}</h6>
          <div className="mb-2 form-check">
            <input onChange={toggleLogin} type="checkbox" className="form-check-input" id="exampleCheck1" />
            <label className="form-check-label" htmlFor="exampleCheck1">Already have an account?</label>
          </div>
          <button type="submit" className="btn btn-primary ">{isLogin ? "Sign In" : "Register"}</button>
          {email.length > 0 && <button onClick={handleResetPassword} className="btn btn-outline-warning">Reset password</button>}
          <h6 className="text-success mt-2">{successMessage}</h6>
        </form>
      </div>
    </div>
  );
}

export default App;
