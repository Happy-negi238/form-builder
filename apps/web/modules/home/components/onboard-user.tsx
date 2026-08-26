"use client"
import { UserButton } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { useCreateUser } from '~/hooks/api/auth/use-create-user';
import { AuthenticatedUser, onBoardUser } from '~/modules/authentication/actions';

const OnboardUser = () => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { createUserWithClerkIdAsync } = useCreateUser();

  useEffect(() => {
    const initUser = async () => {
      try {
        const userData = await onBoardUser();

        if (!userData?.clerkId) {
          return;
        }

        setUser(userData);

        const { clerkId, emailAddresses, firstName, imageUrl, lastName } = userData;
        const { id } = await createUserWithClerkIdAsync({
          clerkId,
          email: emailAddresses,
          firstName,
          lastName,
          profileImageUrl: imageUrl,
          role: "USER",
        });

        setUserId(id);
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  return (
    <UserButton />
  )
}

export default OnboardUser
