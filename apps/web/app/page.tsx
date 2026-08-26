import OnboardUser from "~/modules/home/components/onboard-user";

import { onBoardUser } from "~/modules/authentication/actions";
import { UserButton } from "@clerk/nextjs";
import protect from "~/modules/protect/actions";

export default async function Home() {
  await protect();
  // await onBoardUser();

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Form Builder</h1>
        <OnboardUser/>
        {/* <UserButton /> */}
      </div>
    </main>
  );
}
