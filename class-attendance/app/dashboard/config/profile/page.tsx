'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Loader2, Mail, Phone, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

import { useApi } from '@/hooks/useApi'
import ApiService from '@/handler/ApiService'
import type { User as UserType } from '@/types'

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use the API hooks for fetching and updating user data
  const { useFetchData: useFetchUser, useUpdateItem: useUpdateUser } = useApi<UserType, UserType>(ApiService.USER_URL)
  const { useAddItem: useChangePassword } = useApi<{}, {}>(ApiService.CHANGE_PASSWORD_URL)

  // Get current user data
  const { data: userData, isLoading: isLoadingUser, refetch: refetchUser } = useFetchUser(1)
  const updateUserMutation = useUpdateUser
  const changePasswordMutation = useChangePassword

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleProfileUpdate = async () => {
    if (updateUserMutation.status === 'pending') return
    
    setIsSaving(true)
    const currentUser = userData?.results[0]
    if (!currentUser?.id) {
      toast.error('User data not found')
      setIsSaving(false)
      return
    }

    updateUserMutation.mutate({ 
      id: currentUser.id, 
      item: {
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        phone_number: currentUser.phone_number
      }
    }, {
      onSuccess: async () => {
        await refetchUser()
        toast.success('Profile updated successfully')
      },
      onError: (error: any) => {
        toast.error('Failed to update profile')
        console.error('Update profile error:', error)
      },
      onSettled: () => {
        setIsSaving(false)
      }
    })
  }

  const handlePasswordChange = async () => {
    // Validate password inputs
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      return
    }

    if (changePasswordMutation.status === 'pending') return

    setIsChangingPassword(true)
    changePasswordMutation.mutate({
      old_password: passwordData.currentPassword,
      new_password: passwordData.newPassword
    }, {
      onSuccess: () => {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        toast.success('Password changed successfully')
      },
      onError: (error: any) => {
        toast.error('Failed to change password')
        console.error('Password change error:', error)
      },
      onSettled: () => {
        setIsChangingPassword(false)
      }
    })
  }

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // TODO: Implement profile image upload using API
      // For now, just show a toast
      toast.info('Profile image upload will be implemented soon')
    }
  }

  useEffect(() => {
    if (!isLoadingUser && userData) {
      setIsLoading(false)
    }
  }, [isLoadingUser, userData])

  const user = userData?.results[0]

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-lg text-muted-foreground">User data not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleProfileImageClick}>
                    <AvatarImage src={user?.registered_face || '/placeholder.svg'} alt={`${user?.first_name} ${user?.last_name}`} />
                    <AvatarFallback className="text-2xl">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-primary-foreground cursor-pointer"
                    onClick={handleProfileImageClick}
                  >
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.role}</p>
                  <p className="text-sm text-muted-foreground">{user?.department?.name}</p>
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{user?.phone_number}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={user?.first_name || ''}
                    onChange={(e) => {
                      if (userData?.results[0]) {
                        userData.results[0].first_name = e.target.value
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={user?.last_name || ''}
                    onChange={(e) => {
                      if (userData?.results[0]) {
                        userData.results[0].last_name = e.target.value
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={user?.phone_number || ''}
                    onChange={(e) => {
                      if (userData?.results[0]) {
                        userData.results[0].phone_number = e.target.value
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePasswordChange} disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing password...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                View your recent account activity and login history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Activity log will be implemented in a future update
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
