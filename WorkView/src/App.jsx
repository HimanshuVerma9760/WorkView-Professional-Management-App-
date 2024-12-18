import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./Components/Header";
import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/HomePage";
import Contact from "./Pages/ContactPage";
import SignUp from "./Pages/SignUp";
import LoginPage from "./Pages/LoginPage";
import LeaderDashboardPage from "./Pages/LeaderDashboardPage";
import { tasksLoader, loader as verifyTokenLoader } from "./Components/Auth";
import MemberDashboardPage from "./Pages/MemberDashboardPage";
import LeaderDashBoard from "./Components/LeaderDashBoard";
import AssignTask from "./Components/AssignTask";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
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
          children: [
            {
              path: "",
              loader: tasksLoader,
              element: <LeaderDashBoard />,
            },
            {
              path: "assign-task",
              loader: verifyTokenLoader,
              element: <AssignTask />,
            },
          ],
        },
        {
          path: "/member/dashboard",
          loader: verifyTokenLoader,
          element: <MemberDashboardPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}
