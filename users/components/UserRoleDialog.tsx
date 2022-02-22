import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useUserRoles } from "../hooks/useUserRoles";
import { useAddUserRole } from "../hooks/useAddUserRoles";
import { useDeleteUserRole } from "../hooks/useDeleteUserRoles";
import { useTranslation } from "react-i18next";
import { Role } from "../../roles/types/role";
import { User } from "../types/user";

type UserRoleDialogProps = {
    onClose: () => void;
    open: boolean;
    user?: User,
};

const UserRoleDialog = ({
    onClose,
    open,
    user,
} : UserRoleDialogProps) => {
    const { t } = useTranslation();
    const { data, isError, isLoading } = useUserRoles(user);
    const { addUserRole } = useAddUserRole();
    const { deleteUserRole } = useDeleteUserRole();

    const handleAddRoleToUser = (userId: string, roleId: string) => {
        addUserRole({userId, roleId})
    }

    const handleRemoveRoleFromUser = (userId: string, roleId: string) => {
        deleteUserRole({userId, roleId})
    }

    const customList = (hasRole: boolean, data?: Role[]) => (
        !isLoading && !isError && data && (      
            <Paper sx={{ width: 260, height: 230, overflow: 'auto' }}>
                <List dense component="div" role="list">
                <ListSubheader component="div" id="nested-list-subheader">
                    {!hasRole ? (t("roleManagement.modal.editPermissions.notAdded")) : (t("roleManagement.modal.editPermissions.added"))}
                </ListSubheader>
                    {data.map((role) => (
                        hasRole === role.hasRole && (
                            <ListItem
                                role="listitem"
                                button
                                onClick={!hasRole ? (() => handleAddRoleToUser(user!.id, role.id)) : (() => handleRemoveRoleFromUser(user!.id, role.id))}
                            >
                                <ListItemText primary={role.name} />{hasRole ? (<RemoveIcon />) : (<AddIcon />)}
                            </ListItem>
                        )
                    ))}
                </List>
            </Paper>    
        )
      );

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="role-dialog-title">
            <DialogTitle id="role-dialog-title">
              {t("userManagement.modal.editUserRoles.title")} - {user!.firstname} {user!.lastname}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item>{customList(false, data)}</Grid>
                    <Grid item>{customList(true, data)}</Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} variant="contained">{t("common.close")}</Button>
            </DialogActions>
        </Dialog>
      );
}

export default UserRoleDialog;