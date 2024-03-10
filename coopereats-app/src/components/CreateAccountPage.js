import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore

const CreateAccountPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState(""); // First name state
    const [lastName, setLastName] = useState(""); // Last name state
    const [phoneNumber, setPhoneNumber] = useState(""); // Phone number state
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const firestore = getFirestore(); // Initialize Firestore

    const createAccount = async () => {
        if (password !== confirmPassword) {
            setError("Password and confirm password do not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
            // Create a user in Firestore with additional details
            await setDoc(doc(firestore, "users", userCredential.user.uid), {
                firstName,
                lastName,
                phoneNumber,
                email // Optional: Store email in Firestore as well
            });
            navigate("/"); // Navigate to home page or dashboard
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <>
            <h1>Create Account</h1>
            {error && <p className="error">{error}</p>}
            <input
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />
            <input
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />
            <input
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
            />
            <input
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />
            <button onClick={createAccount}>Create Account</button>
            <Link to="/login">Already have an account? Log in here.</Link>
        </>
    );
}

export default CreateAccountPage;
