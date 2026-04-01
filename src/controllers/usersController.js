import {
  deleteUserById,
  getAllRoles,
  getAllUsers,
  getUserById,
  updateUserRole
} from "../models/usersModel.js";

function normalizeUserRoleForm(body = {}) {
  return {
    role_id: Number(body.role_id)
  };
}

function validateUserRoleForm(formData) {
  const errors = [];

  if (!formData.role_id || Number.isNaN(formData.role_id)) {
    errors.push("Please select a valid role.");
  }

  return errors;
}

export async function buildManageUsersPage(req, res, next) {
  try {
    const users = await getAllUsers();

    res.render("users/manage", {
      title: "Manage Users",
      users
    });
  } catch (error) {
    next(error);
  }
}

export async function buildEditUserPage(req, res, next) {
  try {
    const userId = Number(req.params.userId);
    const [accountUser, roles] = await Promise.all([
      getUserById(userId),
      getAllRoles()
    ]);

    if (!accountUser) {
      return res.status(404).render("404", {
        title: "User Not Found"
      });
    }

    res.render("users/edit", {
      title: "Edit User Role",
      accountUser,
      roles,
      errors: [],
      formData: {
        role_id: accountUser.role_id ?? ""
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRoleSubmission(req, res, next) {
  try {
    const userId = Number(req.params.userId);
    const [accountUser, roles] = await Promise.all([
      getUserById(userId),
      getAllRoles()
    ]);

    if (!accountUser) {
      return res.status(404).render("404", {
        title: "User Not Found"
      });
    }

    const formData = normalizeUserRoleForm(req.body);
    const errors = validateUserRoleForm(formData);

    if (req.session.user.user_id === userId && formData.role_id !== accountUser.role_id) {
      errors.push("You cannot change your own role.");
    }

    if (errors.length > 0) {
      return res.status(400).render("users/edit", {
        title: "Edit User Role",
        accountUser,
        roles,
        errors,
        formData
      });
    }

    await updateUserRole(userId, formData.role_id);

    res.redirect("/users/manage");
  } catch (error) {
    next(error);
  }
}

export async function deleteUserSubmission(req, res, next) {
  try {
    const userId = Number(req.params.userId);

    if (req.session.user.user_id === userId) {
      return res.status(400).send("You cannot delete your own account.");
    }

    const deletedUser = await deleteUserById(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found.");
    }

    res.redirect("/users/manage");
  } catch (error) {
    next(error);
  }
}