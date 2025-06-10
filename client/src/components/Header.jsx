import { NavLink } from "react-router-dom";


function Header({user, setUser}) {
    function handleLogoutClick() {
      fetch("/logout", { method: "DELETE" }).then((r) => {
        if (r.ok) {
          setUser(null);
        }
      });
    }
return (
  <nav className="navbar">
    <NavLink to='/' className='nav-link'>Home   </NavLink>
    <NavLink to='/hikes' className='nav-link'>Hikes   </NavLink>
    <NavLink to='/about' className='nav-link'>About</NavLink>

    {user ? (
      <>
        <span className="nav-user">Signed in as: {user.username}</span>
        <button onClick={handleLogoutClick} className="nav-link">Logout</button>
      </>
    ) : (
      <>
        <NavLink to='/signup' className='nav-link'>Signup</NavLink>
      </>
    )}
  </nav>
);
}

export default Header