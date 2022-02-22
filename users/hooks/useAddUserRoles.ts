import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Role } from "../../roles/types/role";

const addUserRole = async ({userId, roleId} : {userId: string, roleId: string}): Promise<Role> => {
  const { data } = await axios.post("/user/roles/grant", { userId, roleId });
  return data;
};

export function useAddUserRole() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addUserRole, {
    onSuccess: (role: Role) => {
      queryClient.setQueryData<Role[]>(["userRoles"], (oldRole) => 
        updateOne(oldRole, role)
      );
    },
  });

  return { isAdding: isLoading, addUserRole: mutateAsync };
}