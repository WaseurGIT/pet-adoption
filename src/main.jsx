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
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import AdminProfile from "./pages/Admin/AdminProfile.jsx";
import UserTable from "./pages/Admin/UserTable.jsx";
import AllPets from "./pages/Admin/AllPets.jsx";
import DonationHistory from "./pages/Admin/DonationHistory.jsx";
import AdoptionHistory from "./pages/Admin/AdoptionHistory.jsx";
import UserProfile from "./pages/User/UserProfile.jsx";
import UserDonationHistory from "./pages/User/UserDonationHistory.jsx";
import UserAdoptionHistory from "./pages/User/UserAdoptionHistory.jsx";
import PetFoods from "./pages/PetFoods.jsx";
import AddPetFoods from "./pages/Admin/AddPetFoods.jsx";
import AddVet from "./pages/AddVet.jsx";
import Vets from "./pages/Vets.jsx";

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
        path: "/petFoods",
        element: <PetFoods />,
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
        path: "addPetFoods",
        element: <AddPetFoods />,
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
        path: "addVets",
        element: <AddVet />,
      },
    ],
  },
  {
    path: "/dashboard/user",
    element: (
      <PrivateRoute role="user">
        <UserDashboard />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <UserProfile />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "userDonationHistory",
        element: <UserDonationHistory />,
      },
      {
        path: "userAdoptionHistory",
        element: <UserAdoptionHistory />,
      },
    ],
  },
  {
    path: "/dashboard/admin",
    element: (
      <PrivateRoute role="admin">
        <AdminDashboard />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminProfile />,
      },
      {
        path: "profile",
        element: <AdminProfile />,
      },
      {
        path: "users",
        element: <UserTable />,
      },
      {
        path: "allPets",
        element: <AllPets />,
      },
      {
        path: "donationHistory",
        element: <DonationHistory />,
      },
      {
        path: "adoptionHistory",
        element: <AdoptionHistory />,
      },
      {
        path: "vets",
        element: <Vets />,
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
