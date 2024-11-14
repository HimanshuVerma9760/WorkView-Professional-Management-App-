export default function LogOut() {
  return localStorage.removeItem("token");
}
