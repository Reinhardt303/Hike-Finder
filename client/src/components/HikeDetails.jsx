import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function HikeDetails() {
  const { id } = useParams();
  const { hikes, user } = useOutletContext();
  const [hike, setHike] = useState(null);
  const [reviews, setReviews] = useState([]);  
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const selectedHike = hikes.find(h => h.id.toString() === id);
    if (selectedHike) setHike(selectedHike);
  }, [id, hikes]);

  useEffect(() => {
    fetch(`/hikes/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to fetch reviews:", err));
  }, [id]);

  const reviewForm = useFormik({
    initialValues: {
      review_text: "",
    },
    validationSchema: Yup.object({
      review_text: Yup.string().required("Review cannot be empty"),
    }),
    onSubmit: (values, { resetForm }) => {
      fetch("/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review_text: values.review_text,
          hike_id: hike.id,
          hiker_id: user?.id,
        }),
      })
        .then(() => fetch(`/hikes/${id}/reviews`))
        .then(res => res.json())
        .then(data => {
          setReviews(data);
          resetForm();
        })
        .catch(err => console.error("Error submitting review:", err));
    },
  });
  const editForm = useFormik({
  enableReinitialize: true,
  initialValues: {
    name: hike?.name || "",
    city: hike?.city || "",
    state: hike?.state || "",
    length: hike?.length ? hike.length.toString() : "",
    difficulty: hike?.difficulty ? hike.difficulty.toString() : "",
  },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      length: Yup.number().required("Required").positive("Must be positive").typeError("Must be a number"),
      difficulty: Yup.number().required("Required").min(1).max(5).typeError("Must be a number between 1 and 5"),
    }),
    onSubmit: (values) => {
      fetch(`/hikes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          length: Number(values.length),
          difficulty: Number(values.difficulty),
        }),
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to update hike");
          return r.json();
        })
        .then((updatedHike) => {
          setHike(updatedHike);
          alert("Hike updated!");
          setEditing(false);
        })
        .catch((err) => console.error(err));
    },
  });
  if (!hikes) return <p>Loading hikes...</p>;
  if (!hike) return <p>Hike not found...</p>;

  

  return (
    <div>
      <h2>{hike.name}</h2>
      <p>Location: {hike.city}, {hike.state}</p>
      <p>Length: {hike.length} miles</p>
      <p>Difficulty: {hike.difficulty}</p>

      <h3>Reviews</h3>
      <div>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map(hiker => (
            <div key={hiker.id}>
              <h4>{hiker.username} ({hiker.name}) from {hiker.city}, {hiker.state}</h4>
              {hiker.reviews.map(review => (
                <p key={review.id}>{review.review_text}</p>
              ))}
            </div>
          ))
        )}
      </div>

      <div>
        <h3>Leave a Review:</h3>
        <form onSubmit={reviewForm.handleSubmit}>
          <textarea
            name="review_text"
            value={reviewForm.values.review_text}
            onChange={reviewForm.handleChange}
            required
          />
          <button type="submit" >Submit Review</button>
        </form>
      </div>

      <div>
        <h3>Edit Hike Info:</h3>
        {editing ? (
          <form onSubmit={editForm.handleSubmit}>
            <input
              name="name"
              value={editForm.values.name}
              onChange={editForm.handleChange}
              placeholder="Name"
            />
            <input
              name="city"
              value={editForm.values.city}
              onChange={editForm.handleChange}
              placeholder="City"
            />
            <input
              name="state"
              value={editForm.values.state}
              onChange={editForm.handleChange}
              placeholder="State"
            />
            <input
              name="length"
              type="number"
              value={editForm.values.length}
              onChange={editForm.handleChange}
              placeholder="Length"
            />
            <input
              name="difficulty"
              type="number"
              value={editForm.values.difficulty}
              onChange={editForm.handleChange}
              placeholder="Difficulty (1–5)"
            />
            <button type="submit">Save</button>
          </form>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
}

export default HikeDetails;