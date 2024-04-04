import React, { useState } from 'react'; // Updated import
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios'; // Import axios


const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState(''); // Add full name state
  const [phoneNumber, setPhoneNumber] = useState(''); // Add phone number state
  const [userName, setUserName] = useState(''); // Add userName state

  const navigate = useNavigate();

  const createAccount = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Password and confirm password do not match');
        return;
      }

      // First, create a user in Firebase
      const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
      const firebaseUid = userCredential.user.uid;
      // Then, create a user in the backend database
      const backendUser = {
        userName: userName,
        email: email,
        password: password, // You might want to hash the password or handle it differently
        fullName: fullName,
        phoneNumber: phoneNumber,
        firebaseUid: firebaseUid, // Add the Firebase UID to the user object
      };
      const response = await axios.post('http://localhost:8080/api/users', backendUser);

      // Check the response from backend
      if (response.status === 200) {
        navigate('/'); // Navigate to home on successful account creation
      } else {
        setError('Failed to create user in backend');
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-form">
        <h1>Create Account</h1>
        {error && <p className="error">{error}</p>}
        <div className="input-group">
          <input
            placeholder="Username"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <button onClick={createAccount}>Create Account</button>
        <p>
          <Link to="/login">Already have an account? Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccountPage;
