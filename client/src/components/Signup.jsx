import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function Signup() {
  const { handleLogin } = useOutletContext();
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
      name: "",
      city: "",
      state: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm your password"),
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: (values) => {
      setErrors([]);
      setIsLoading(true);
      fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          password_confirmation: values.passwordConfirmation,
          name: values.name,
          city: values.city,
          state: values.state,
        }),
      })
        .then((r) => {
          setIsLoading(false);
          if (r.ok) {
            r.json().then((user) => handleLogin(user));
          } else {
            r.json().then((err) => setErrors(err.errors));
          }
        });
    },
  });


  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
      </div>

      <div>
        <label htmlFor="passwordConfirmation">Confirm Password</label>
        <input
          id="passwordConfirmation"
          type="password"
          value={formik.values.passwordConfirmation}
          onChange={formik.handleChange}
        />
      </div>

      <div>
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.errors.name && formik.touched.name && (
          <div style={{ color: "red" }}>{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="city">City</label>
        <textarea
          id="city"
          value={formik.values.city}
          onChange={formik.handleChange}
        />
      </div>

      <div>
        <label htmlFor="state">State</label>
        <textarea
          id="state"
          value={formik.values.state}
          onChange={formik.handleChange}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Sign Up"}
      </button>

      {errors.length > 0 &&
        errors.map((error) => (
          <div key={error} style={{ color: "red" }}>
            {error}
          </div>
        ))}
    </form>
  );
}

export default Signup;