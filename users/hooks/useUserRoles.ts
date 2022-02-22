import axios from "axios";
import { useQuery } from "react-query";
import { Role } from "../../roles/types/role";
import { User } from "../types/user";

const fetchUserRoles = async (user?: User): Promise<Role[]> => {
    const { data } = await axios.post("/user/roles", user);
    return data;
};

export function useUserRoles(user?: User) {
    return useQuery("userRoles", () => fetchUserRoles(user), {
        suspense: false,
    });
}