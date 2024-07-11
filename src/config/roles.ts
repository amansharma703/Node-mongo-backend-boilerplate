export class Roles {
    public static readonly allRoles = {
        user: ['user_get', 'user_update'],
        admin: ['admin_getUsers', 'admin_manageUsers'],
    };

    public static readonly roles = Object.keys(this.allRoles);
    public static readonly roleRights = new Map(Object.entries(this.allRoles));
}
