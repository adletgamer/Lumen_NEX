import { getCurrentUser, updateProfile, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProfileForm from "./profile-form"

export default async function ProfilePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <ProfileForm 
      user={user} 
      profile={user.profile}
      updateProfileAction={updateProfile}
      signOutAction={signOut}
    />
  )
}
