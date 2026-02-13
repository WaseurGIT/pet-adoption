import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import Pets from "./pages/Pets.jsx";
import PetDetails from "./pages/PetDetails.jsx";
import AdoptionPage from "./pages/AdoptionPage.jsx";
import DonationPage from "./pages/DonationPage.jsx";
import Reviews from "./pages/Reviews.jsx";
import WriteReview from "./pages/WriteReview.jsx";
import AddPet from "./pages/AddPet.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/pets",
        element: <Pets />,
      },
      {
        path: "/pet/:id",
        element: <PetDetails />,
      },
      {
        path: "/adoption/:petId",
        element: <AdoptionPage />,
      },
      {
        path: "/addPet",
        element: <AddPet />,
      },
      {
        path: "/donation",
        element: <DonationPage />,
      },
      {
        path: "/reviews",
        element: <Reviews />,
      },
      {
        path: "/write-review",
        element: <WriteReview />,
      },
      {
        element: <AdminRoute />,
        children: [{ path: "/admin/dashboard", element: <AdminDashboard /> }],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
