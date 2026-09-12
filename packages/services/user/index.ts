import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import {
  CreateUserWithClerkIdInputType,
  createUserWithClerkIdInput,
  getUserByClerkIdInput,
  GetUserByClerkIdInputType,
} from "./model";

class UserService {
  private async checkUserExistsByClerkId(clerkId: string) {
    if (!clerkId) {
      throw new Error("Clerk Id is required");
    }

    const existingUser = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }
  }

  public async createUserWithClerkId(payload: CreateUserWithClerkIdInputType) {
    const { clerkId, email, firstName, role, lastName, profileImageUrl } =
      await createUserWithClerkIdInput.parseAsync(payload);

    const insertUser = await db
      .insert(usersTable)
      .values({
        clerkId,
        email,
        firstName,
        lastName,
        profileImageUrl,
        role,
      })
      .onConflictDoUpdate({
        target: usersTable.clerkId,
        set: {
          email,
          firstName,
          lastName,
          profileImageUrl,
          role,
        },
      })
      .returning({
        id: usersTable.id,
        clerkId: usersTable.clerkId,
      });

    if (insertUser.length === 0 || !insertUser[0]?.id || !insertUser[0].clerkId) {
      throw new Error("Failed to create user");
    }

    return {
      id: insertUser[0].id,
    };
  }

  public async getUserByClerkId(payload: GetUserByClerkIdInputType) {
    const { clerkId } = await getUserByClerkIdInput.parseAsync(payload);

    if (!clerkId) {
      throw new Error("Id is not defined");
    }

    const result = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));

    if (!result || !result[0]?.role) {
      throw new Error("User not found with this id");
    }

    return result;
  }
}

export default UserService;
