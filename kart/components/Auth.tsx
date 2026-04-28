"use client";
import SignIn from "./SignIn";
import { useUser, UserButton } from "@clerk/nextjs";

export default function AuthUI() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      {!isSignedIn ? <SignIn /> : <UserButton />}
    </>
  );
}