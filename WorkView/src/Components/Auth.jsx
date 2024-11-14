export default async function Auth(token) {
 try {
    const response = await fetch(
      "http://localhost:3000/team-leader/dashboard",
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

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

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    localStorage.removeItem("token");
    return redirectToLogin();
  }

  const { valid, result } = await Auth(token);
  if (valid) {
    return result;
  } else {
    localStorage.removeItem("token");
    return redirectToLogin();
  }
}

function redirectToLogin() {
  return new Response(null, {
    status: 302,
    headers: { Location: "/login" },
  });
}
