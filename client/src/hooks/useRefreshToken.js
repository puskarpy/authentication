import { useCallback } from "react";
import axios from "../api/axios.js";
import { useAuth } from "./useAuth.js";

export const useRefreshToken = () => {

    const {setAuth}= useAuth()

    const refresh = useCallback(async() => {
        const res = await axios.get("/api/v1/users/refresh", {
            withCredentials: true
        })
        setAuth((prev) => {
            return {...prev, user:res.data.data.user ,accessToken: res.data.data.accessToken}
        })
        return res.data.data.accessToken
    }, [setAuth])

  return refresh;
}
