import Login from './Login';
import { useNavigate, useOutletContext } from 'react-router-dom';


function Home() {
  const { handleLogin, user } = useOutletContext();
  const navigate = useNavigate();  // <-- Add this line
  if (user) {
    return (
  <>
    <h1>Welcome, {user.name}!</h1>
    <h2>Click on Hikes in the navigation bar to get started!</h2>
  </>
);
  }else {
  return (
    <main>
      <h1>Home Page</h1>
      <p>Welcome to HikeFinder!</p>
      <Login onLogin={handleLogin} />
      <section>
        <h2>Or Make An Account</h2>  
        <button onClick={() => navigate('/signup')}>
          Go to Signup
        </button>
      </section>
    </main>
  );
}
}
export default Home;