import { useOutletContext } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useOutletContext();

  if (!user) {
    return <p>Please log in to access hikes.</p>;
  }

  return children;
}

export default ProtectedRoute;
