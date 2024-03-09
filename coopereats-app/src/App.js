import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/CreateAccountPage';

function Home() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const loadUsers = async () => {
      const response = await axios.get(`http://localhost:8080/api/getUsers`);
      setData(response.data);
    };

    loadUsers();
  }, []);

  if (data) {
    return (
      <>
        <h1>RPS</h1>
        <nav>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/create-account">Create Account</Link> {/* Added link to Create Account */}
        </nav>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
    );
  }

  return <h1>Data</h1>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-account" element={<CreateAccountPage />} /> {/* Route for create account page */}
          {/* Define other routes for /about and /contact if necessary */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
