import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./Components/Header";
import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/HomePage";
import Contact from "./Pages/ContactPage";
import SignUp from "./Pages/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/contact-us",
        element: <Contact />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/member-sign-up",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <h1>Login</h1>,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
