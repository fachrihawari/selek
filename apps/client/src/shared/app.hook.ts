import { useNavigate } from "react-router";
import { mutate } from "swr";

export function useLogout() {
  const navigate = useNavigate();

  function logout() {
    // Remove the access token from local storage
    localStorage.clear();

    // Revalidate the SWR cache for the user
    mutate(() => true, null, { revalidate: false });

    // Redirect to the login page
    navigate("/login");
  }

  return logout
}