import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Role } from "../../roles/types/role";

const deleteUserRole = async ({userId, roleId} : {userId: string, roleId: string}): Promise<Role> => {
  const { data } = await axios.post("/user/roles/revoke", { userId, roleId });
  return data;
};

export function useDeleteUserRole() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteUserRole, {
    onSuccess: (role: Role) => {
      queryClient.setQueryData<Role[]>(["userRoles"], (oldRole) => 
        updateOne(oldRole, role)
      );
    },
  });

  return { isDeleting: isLoading, deleteUserRole: mutateAsync };
}