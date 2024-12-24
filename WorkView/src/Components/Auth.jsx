  const backendAPI=import.meta.env.VITE_BACKEND_API;

export default async function Auth(token, pathName) {
  let apiName = pathName === "/member/dashboard" ? "member" : "team-leader";

  if (pathName === "/member/dashboard") {
    apiName = "member";
  } else {
    apiName = "team-leader";
  }
  try {
    const response = await fetch(`${backendAPI}/${apiName}/dashboard`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { valid: false, error: "Invalid token, kindly log out" };
    }

    const result = await response.json();
    return { valid: true, result };
  } catch (error) {
    console.error("Error in authentication:", error);
    return { valid: false, error: "Network error, please try again" };
  }
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const apiName = url.pathname;
  const token = localStorage.getItem("token");
  const whichDash = localStorage.getItem("whichDash");
  if (!token || !whichDash) {
    return redirectToLogin();
  }

  const { valid, result } = await Auth(token, apiName);
  if (valid) {
    return result;
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("whichDash");
    return redirectToLogin();
  }
}

function redirectToLogin() {
  return new Response(null, {
    status: 302,
    headers: { Location: "/login" },
  });
}

export async function tasksLoader() {
  let response;
  try {
    response = await fetch(
      "http://localhost:3000/team-leader/get-updated-leader-data",
      {
        method: "get",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error occured while fetching leader data!");
    } else {
      const result = await response.json();
      return result;
    }
  } catch (error) {
    throw new Error(error);
  }
}
