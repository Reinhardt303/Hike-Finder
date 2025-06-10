import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import HikeCard from './HikeCard';
import CreateHike from './CreateHike';
import Form from './Form';  

function Hikes() {
  const { hikes, setHikes } = useOutletContext();  
  const [filteredHikes, setFilteredHikes] = useState(hikes);

  useEffect(() => {
    setFilteredHikes(hikes);
  }, [hikes]);

  function handleSearch(searchTerm) {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = hikes.filter((hike) => {
      const name = hike.name?.toLowerCase() || "";
      const state = hike.state?.toLowerCase() || "";
      return name.includes(lowerTerm) || state.includes(lowerTerm);
    });
    setFilteredHikes(filtered);
  }

  function handleAddHike(newHike) {
    setHikes(prevHikes => [...prevHikes, newHike]);       
    setFilteredHikes(prevFiltered => [...prevFiltered, newHike]); 
  }

  function handleDelete(id) {
    setHikes(prevHikes => prevHikes.filter(hike => hike.id !== id));
    setFilteredHikes(prevFiltered => prevFiltered.filter(hike => hike.id !== id));
  }

  return (
    <>
      <h1>Hikes</h1>
      <CreateHike onAddHike={handleAddHike} />
      <Form onSearch={handleSearch} />
      <ul>
        {(filteredHikes || []).map(hike => (
          <HikeCard key={hike.id} hike={hike} onDelete={handleDelete} />
        ))}
      </ul>
    </>
  );
}

export default Hikes;