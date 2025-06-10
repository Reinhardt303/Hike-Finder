import { Link } from 'react-router-dom';

function HikeCard({ hike, onDelete }) {
  const handleDelete = () => {
    fetch(`http://localhost:5555/hikes/${hike.id}`, {
      method: 'DELETE',
    })
    .then((res) => {
      if (res.ok) {
        onDelete(hike.id);
      } else {
        alert('Failed to delete hike');
      }
    });
  };

  return (
    <li>
      <h2>{hike.name}</h2>
      <p>Location: {hike.city}, {hike.state}</p>
      <Link to={`/hikes/${hike.id}`}>View Hike Details</Link>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default HikeCard;
