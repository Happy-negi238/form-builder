"use server";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AuthenticatedUser = {
  clerkId: string;
  imageUrl: string | undefined;
  emailAddresses: string;
  firstName: string;
  lastName: string | undefined;
} | null;

export const onBoardUser = async (): Promise<AuthenticatedUser | null> => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const { id: clerkId, imageUrl, emailAddresses, firstName, lastName } = user;

  return {
    clerkId,
    imageUrl,
    emailAddresses: emailAddresses[0]?.emailAddress || "",
    firstName: firstName || "",
    lastName: lastName || "",
  };
};

export const requireAuth = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  
  return null;
};
