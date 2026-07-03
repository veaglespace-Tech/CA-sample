import * as usersModule from "../../services/users.js";
import { validatePassword } from "../../utils/passwordValidation.js";

export async function createUser(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, message: "Name, email, and password are required." });
    }

    // ── Password strength validation ──
    const pwdError = validatePassword(password);
    if (pwdError) {
      return res.status(400).json({ ok: false, message: pwdError });
    }

    const user = await usersModule.insertUser({ name, email, password, role, phone }, req.user);
    res.status(201).json({ ok: true, data: user });
  } catch (error) {
    console.error("Error creating user:", error);
    const statusCode =
      error.message.includes("already exists") ? 400 :
      error.message.includes("Only super admins") ? 403 :
      500;
    res.status(statusCode).json({ ok: false, message: error.message || "Failed to create user." });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;

    // ── Validate password only if provided ──
    if (req.body?.password) {
      const pwdError = validatePassword(req.body.password);
      if (pwdError) {
        return res.status(400).json({ ok: false, message: pwdError });
      }
    }

    const user = await usersModule.modifyUser(id, req.body, req.user);
    res.status(200).json({ ok: true, data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    const statusCode =
      error.message.includes("User not found") ? 404 :
      error.message.includes("Only super admins") ? 403 :
      500;
    res.status(statusCode).json({ ok: false, message: error.message || "Failed to update user." });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await usersModule.removeUser(id, req.user);
    res.status(200).json({ ok: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    const statusCode =
      error.message.includes("own account") ? 400 :
      error.message.includes("User not found") ? 404 :
      error.message.includes("Only super admins") ? 403 :
      500;
    res.status(statusCode).json({ ok: false, message: error.message || "Failed to delete user." });
  }
}

export async function searchUsers(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ ok: true, data: [] });
    const users = await usersModule.findUsers(q, req.user);
    res.status(200).json({ ok: true, data: users });
  } catch (error) {
    console.error("Search Users Error:", error);
    res.status(500).json({ ok: false, message: "Failed to search users." });
  }
}
