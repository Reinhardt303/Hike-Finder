import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./components/Routes"; 
import "./index.css";


const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

// Create the router from your routes array
const router = createBrowserRouter(routes);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);