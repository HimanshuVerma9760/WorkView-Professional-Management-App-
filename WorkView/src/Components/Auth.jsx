export default async function Auth() {
  const token = localStorage.getItem("token");
  if (!token) {
    return { valid: false };
  }

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
      return { valid: false, message: "Invalid token, kindly Log out" };
    }

    const result = await response.json();
    return { valid: true, result };
  } catch (error) {
    console.error("Error in authentication:", error);
    return { valid: false };
  }
}
