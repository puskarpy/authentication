import { useAuth } from "./useAuth";
import toast from "react-hot-toast";
import { useAxiosPrivate } from "./useAxiosPrivate";

export default function useLogout() {

    const { setAuth, auth } = useAuth()
    const AxiosPrivate = useAxiosPrivate()

    const logout = async() => {
        try {
            const res = await AxiosPrivate.post("/api/v1/users/logout",{}, {
                withCredentials: true,
                headers: true
            })
            setAuth({})
            toast.success(res.data.data)
        } catch (error) {
            console.error(error)
        }
    }

  return logout
}
