'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, Mail, Phone, Save, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Mock user data
  const [userData, setUserData] = useState({
    id: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phone: '+254 712 345 678',
    role: 'config_user',
    department: 'IT Administration',
    bio: 'System administrator responsible for configuration and maintenance of the attendance system.',
    profileImage: '/placeholder.svg?height=100&width=100',
    lastLogin: '2023-11-10T08:30:45Z',
    accountCreated: '2023-01-15T10:00:00Z',
  })

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleProfileUpdate = () => {
    setIsSaving(true)
    
    // Simulate API call to update profile
    setTimeout(() => {
      setIsSaving(false)
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated successfully.',
      })
    }, 1500)
  }

  const handlePasswordChange = () => {
    // Validate password inputs
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirmation do not match.',
        variant: 'destructive',
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'New password must be at least 8 characters long.',
        variant: 'destructive',
      })
      return
    }

    setIsChangingPassword(true)
    
    // Simulate API call to change password
    setTimeout(() => {
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      
      toast({
        title: 'Password Changed',
        description: 'Your password has been updated successfully.',
      })
    }, 1500)
  }

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // Simulate image upload
      const reader = new FileReader()
      reader.onload = () => {
        setUserData({
          ...userData,
          profileImage: reader.result as string,
        })
        
        toast({
          title: 'Profile Image Updated',
          description: 'Your profile image has been updated successfully.',
        })
      }
      reader.readAsDataURL(file)
    }
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
                    <AvatarImage src={userData.profileImage} alt={`${userData.firstName} ${userData.lastName}`} />
                    <AvatarFallback className="text-2xl">
                      {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
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
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{userData.role}</p>
                  <p className="text-sm text-muted-foreground">{userData.department}</p>
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{userData.phone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
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
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium">Authenticator App</h3>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app to generate one-time codes
                  </p>
                </div>
                <Button variant="outline">Setup</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium">SMS Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a code via SMS to verify your identity
                  </p>
                </div>
                <Button variant="outline">Setup</Button>
              </div>
            </CardContent>
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
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Account Information</h3>
                  <div className="mt-2 rounded-lg border p-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium">User ID</p>
                        <p className="text-sm text-muted-foreground">{userData.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Role</p>
                        <p className="text-sm text-muted-foreground capitalize">{userData.role.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Account Created</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(userData.accountCreated).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Login</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(userData.lastLogin).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Recent Login Activity</h3>
                  <div className="mt-2 space-y-2">
                    {[
                      {
                        date: '2023-11-10T08:30:45Z',
                        ip: '192.168.1.1',
                        location: 'Nairobi, Kenya',
                        device: 'Chrome on Windows',
                      },
                      {
                        date: '2023-11-09T14:22:30Z',
                        ip: '192.168.1.1',
                        location: 'Nairobi, Kenya',
                        device: 'Safari on macOS',
                      },
                      {
                        date: '2023-11-08T09:15:12Z',
                        ip: '192.168.1.1',
                        location: 'Nairobi, Kenya',
                        device: 'Chrome on Windows',
                      },
                      {
                        date: '2023-11-07T16:45:33Z',
                        ip: '192.168.1.1',
                        location: 'Nairobi, Kenya',
                        device: 'Chrome on Windows',
                      },
                      {
                        date: '2023-11-06T11:10:05Z',
                        ip: '192.168.1.1',
                        location: 'Nairobi, Kenya',
                        device: 'Chrome on Windows',
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {new Date(activity.date).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.device} • {activity.ip}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.location}</p>
                        </div>
                        <div className="flex h-2 w-2 rounded-full bg-green-500" title="Successful login" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
