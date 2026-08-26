"use server";
import { currentUser } from "@clerk/nextjs/server";

export type AuthenticatedUser = {
  clerkId: string;
  imageUrl: string | undefined;
  emailAddresses: string;
  firstName: string;
  lastName: string | undefined;
} | null;

export const onBoardUser = async (): Promise<AuthenticatedUser | null> => {
  console.log("call action");
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
