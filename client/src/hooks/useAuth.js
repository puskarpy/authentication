import { useContext } from "react";
import { AuthContext } from "../store/store.jsx";

export const useAuth = () => {
    return useContext(AuthContext)
}