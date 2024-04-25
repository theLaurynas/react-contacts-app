import { redirect } from "react-router-dom";
import { logout } from "../contacts";

export async function loader() {
  logout();
  return redirect("/");
}
