import { useState } from 'react';
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
<<<<<<< HEAD
  const [userName, setUserName] = useState(''); // Add userName state
=======
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6

  const navigate = useNavigate();

  const createAccount = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Password and confirm password do not match');
        return;
      }

      // First, create a user in Firebase
      const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);

      // Then, create a user in the backend database
      const backendUser = {
<<<<<<< HEAD
        userName: userName,
=======
        userName: email, // This should be a unique username, not the email
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
        email: email,
        password: password, // You might want to hash the password or handle it differently
        fullName: fullName,
        phoneNumber: phoneNumber,
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
<<<<<<< HEAD
                        placeholder="Username"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input
=======
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
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
