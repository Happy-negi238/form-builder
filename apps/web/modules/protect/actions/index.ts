import { auth } from "@clerk/nextjs/server";

export default async function protect() {
  return await auth.protect();
}
