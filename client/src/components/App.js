import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from './Header';

function App() {
  const [user, setUser] = useState(null);
  const [hikes, setHikes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5555/hikes")
      .then((r) => r.json())
      .then((data) => setHikes(data));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/hikes');
  };

  return (
    <>
      <header>
        <Header user={user} setUser={setUser} />
      </header>
      <main>
        <Outlet context={{ user, handleLogin, hikes, setHikes, setUser }} />
      </main>
    </>
  );
}

export default App;
