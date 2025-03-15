"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Camera, Loader2, Mail, Phone, User } from "lucide-react"
import { toast } from "sonner"

// API integration
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import type { User as UserType } from "@/types"
import authManager from "@/handler/AuthManager"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profileData, setProfileData] = useState<UserType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  })
  
  // Password form state - removed currentPassword
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  // API hooks for fetching and updating user profile
  const { useFetchData: useFetchProfile, useUpdateItem: useUpdateProfile } = useApi<UserType, UserType>(ApiService.USER_URL)
  const { data: userData, isLoading: isLoadingProfile, refetch: refetchProfile } = useFetchProfile(1)
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile

  // Initialize form data when profile data is loaded
  useEffect(() => {
    if (userData?.results && userData.results.length > 0) {
      const user = userData.results[0]
      setProfileData(user)
      
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone_number || '',
        address: user.address || '',
      })
    }
  }, [userData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    // Convert dash-case to camelCase properly
    let fieldName
    if (id === 'first-name') {
      fieldName = 'firstName'
    } else if (id === 'last-name') {
      fieldName = 'lastName'
    } else {
      // For other fields without dashes or with simple mappings
      fieldName = id
    }
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    // Fixed mapping for password fields
    const fieldName = id === 'password-new' ? 'newPassword' : 'confirmPassword'
    
    setPasswordData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSaveProfile = () => {
    if (!profileData?.id) return
    
    // Validate input
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required")
      return
    }
    
    setIsSaving(true)
    
    // Create FormData to handle both text fields and potentially files
    const formDataObj = new FormData()
    formDataObj.append('first_name', formData.firstName.trim())
    formDataObj.append('last_name', formData.lastName.trim())
    formDataObj.append('email', formData.email)
    
    if (formData.phone) {
      formDataObj.append('phone_number', formData.phone)
    }
    
    if (formData.address) {
      formDataObj.append('address', formData.address)
    }
    
    // Use AuthManager to update user profile
    authManager.updateUser(profileData.id, formDataObj)
      .then(() => {
        toast.success("Profile updated successfully")
        refetchProfile()
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to update profile")
        console.error("Profile update error:", error)
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  const handleChangePassword = async () => {
    // Validate passwords - removed current password check
    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    setIsChangingPassword(true)
    
    try {
      await authManager.changePassword(
        passwordData.newPassword,
        passwordData.confirmPassword
      )
      
      toast.success("Password changed successfully")
      
      // Reset form
      setPasswordData({
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      toast.error(error?.message || "Failed to change password")
      console.error("Password change error:", error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !profileData?.id) return
    
    const file = e.target.files[0]
    setIsLoading(true)
    
    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append('registered_face', file)
    
    try {
      // Use AuthManager to upload the profile photo
      await authManager.updateUser(profileData.id, formData)
      toast.success("Profile photo updated")
      refetchProfile()
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload profile photo")
      console.error("Photo upload error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!profileData?.first_name && !profileData?.last_name) return "U"
    
    const firstInitial = profileData.first_name ? profileData.first_name.charAt(0) : ''
    const lastInitial = profileData.last_name ? profileData.last_name.charAt(0) : ''
    
    return `${firstInitial}${lastInitial}`
  }

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={profileData?.registered_face || "/placeholder.svg?height=96&width=96"} 
                  alt={`${profileData?.first_name} ${profileData?.last_name}`.trim() || "User"} 
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="font-medium">
                  {`${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profileData?.role ? profileData.role.toLocaleLowerCase() : "Student"}
                </p>
              </div>
              <div className="relative w-full">
                <Input
                  type="file"
                  accept="image/*"
                  id="photo-upload"
                  ref={fileInputRef}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handlePhotoChange}
                  disabled={isLoading}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  disabled={isLoading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Change Photo
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Student ID: {profileData?.student_id || "-"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData?.email || "-"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData?.phone_number || "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name" 
                        value={formData.firstName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name" 
                        value={formData.lastName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving || 
                      !formData.firstName.trim() || 
                      !formData.lastName.trim()}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-new">New Password</Label>
                    <Input 
                      id="password-new" 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Confirm New Password</Label>
                    <Input 
                      id="password-confirm" 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleChangePassword} 
                    disabled={isChangingPassword || 
                      !passwordData.newPassword || 
                      !passwordData.confirmPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage your notification settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-muted-foreground">
                    Notification preferences will be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

