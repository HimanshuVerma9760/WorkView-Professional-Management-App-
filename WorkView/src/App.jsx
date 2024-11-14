import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./Components/Header";
import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/HomePage";
import Contact from "./Pages/ContactPage";
import SignUp from "./Pages/SignUp";
import LoginPage from "./Pages/LoginPage";
import LeaderDashboardPage from "./Pages/LeaderDashboardPage";
import { loader as verifyTokenLoader } from "./Components/Auth";

export default function App() {
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
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/member-login",
          element: <LoginPage />,
        },
        {
          path: "/member-sign-up",
          element: <SignUp />,
        },
        {
          path: "/team-leader/dashboard",
          loader: verifyTokenLoader,
          element: <LeaderDashboardPage />,
        },
      ],
    },
  ]);

  // useEffect(() => {
  //   localStorage.getItem("token") ? setIsLogin(true) : setIsLogin(false);
  // }, []);
  return <RouterProvider router={router}></RouterProvider>;
}
