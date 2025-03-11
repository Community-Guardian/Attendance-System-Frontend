'use client'

import { useState, useEffect } from 'react'
import { Download, Edit, Filter, Loader2, MoreHorizontal, Plus, Search, Trash2, Upload, UserPlus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { User } from '@/types'

// Define types for user data
interface UserWithDetails extends User {
  id: string
  email: string
  role: 'student' | 'lecturer' | 'hod' | 'dean' | 'config_user' | 'admin'
  first_name: string
  last_name: string
  department?: string
  programmes?: string[]
  student_id?: string
  employee_id?: string
  phone_number?: string
  is_verified: boolean
  date_joined: string
  last_updated: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
}

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserWithDetails | null>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'student' as 'student' | 'lecturer' | 'hod' | 'dean' | 'config_user' | 'admin',
    department: '',
    programmes: [] as string[],
    student_id: '',
    employee_id: '',
    phone_number: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
  })
  const { toast } = useToast()

  // Mock data
  const departments = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'it', name: 'Information Technology' },
    { id: 'ee', name: 'Electrical Engineering' },
    { id: 'me', name: 'Mechanical Engineering' },
    { id: 'bs', name: 'Business School' },
  ]

  const programmes = [
    { id: 'bsc-cs', name: 'BSc Computer Science', departmentId: 'cs' },
    { id: 'bsc-it', name: 'BSc Information Technology', departmentId: 'it' },
    { id: 'bsc-ee', name: 'BSc Electrical Engineering', departmentId: 'ee' },
    { id: 'bsc-me', name: 'BSc Mechanical Engineering', departmentId: 'me' },
    { id: 'bba', name: 'Bachelor of Business Administration', departmentId: 'bs' },
    { id: 'msc-cs', name: 'MSc Computer Science', departmentId: 'cs' },
    { id: 'msc-it', name: 'MSc Information Technology', departmentId: 'it' },
  ]

  const users: UserWithDetails[] = [
    {
      id: '1',
      email: 'john.smith@university.edu',
      role: 'lecturer',
      first_name: 'John',
      last_name: 'Smith',
      department: 'Computer Science',
      employee_id: 'EMP001',
      phone_number: '+1234567890',
      is_verified: true,
      date_joined: '2022-01-15',
      last_updated: '2023-05-20',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '2',
      email: 'jane.wilson@university.edu',
      role: 'lecturer',
      first_name: 'Jane',
      last_name: 'Wilson',
      department: 'Computer Science',
      employee_id: 'EMP002',
      phone_number: '+1234567891',
      is_verified: true,
      date_joined: '2022-02-10',
      last_updated: '2023-06-15',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '3',
      email: 'sarah.davis@university.edu',
      role: 'lecturer',
      first_name: 'Sarah',
      last_name: 'Davis',
      department: 'Information Technology',
      employee_id: 'EMP003',
      phone_number: '+1234567892',
      is_verified: true,
      date_joined: '2022-03-05',
      last_updated: '2023-04-10',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '4',
      email: 'michael.wilson@university.edu',
      role: 'hod',
      first_name: 'Michael',
      last_name: 'Wilson',
      department: 'Information Technology',
      employee_id: 'EMP004',
      phone_number: '+1234567893',
      is_verified: true,
      date_joined: '2021-11-20',
      last_updated: '2023-03-15',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '5',
      email: 'lisa.johnson@university.edu',
      role: 'lecturer',
      first_name: 'Lisa',
      last_name: 'Johnson',
      department: 'Electrical Engineering',
      employee_id: 'EMP005',
      phone_number: '+1234567894',
      is_verified: true,
      date_joined: '2022-04-12',
      last_updated: '2023-02-28',
      status: 'inactive',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '6',
      email: 'thomas.white@university.edu',
      role: 'lecturer',
      first_name: 'Thomas',
      last_name: 'White',
      department: 'Mechanical Engineering',
      employee_id: 'EMP006',
      phone_number: '+1234567895',
      is_verified: true,
      date_joined: '2022-05-18',
      last_updated: '2023-01-10',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '7',
      email: 'emily.brown@university.edu',
      role: 'lecturer',
      first_name: 'Emily',
      last_name: 'Brown',
      department: 'Business School',
      employee_id: 'EMP007',
      phone_number: '+1234567896',
      is_verified: true,
      date_joined: '2022-06-22',
      last_updated: '2023-07-05',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '8',
      email: 'robert.green@university.edu',
      role: 'hod',
      first_name: 'Robert',
      last_name: 'Green',
      department: 'Business School',
      employee_id: 'EMP008',
      phone_number: '+1234567897',
      is_verified: true,
      date_joined: '2021-10-15',
      last_updated: '2023-08-20',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '9',
      email: 'alice.student@university.edu',
      role: 'student',
      first_name: 'Alice',
      last_name: 'Student',
      department: 'Computer Science',
      programmes: ['BSc Computer Science'],
      student_id: 'STU001',
      phone_number: '+1234567898',
      is_verified: true,
      date_joined: '2023-01-05',
      last_updated: '2023-09-10',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '10',
      email: 'bob.student@university.edu',
      role: 'student',
      first_name: 'Bob',
      last_name: 'Student',
      department: 'Information Technology',
      programmes: ['BSc Information Technology'],
      student_id: 'STU002',
      phone_number: '+1234567899',
      is_verified: true,
      date_joined: '2023-01-10',
      last_updated: '2023-09-15',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '11',
      email: 'charlie.student@university.edu',
      role: 'student',
      first_name: 'Charlie',
      last_name: 'Student',
      department: 'Electrical Engineering',
      programmes: ['BSc Electrical Engineering'],
      student_id: 'STU003',
      phone_number: '+1234567900',
      is_verified: false,
      date_joined: '2023-01-15',
      last_updated: '2023-01-15',
      status: 'inactive',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '12',
      email: 'david.student@university.edu',
      role: 'student',
      first_name: 'David',
      last_name: 'Student',
      department: 'Mechanical Engineering',
      programmes: ['BSc Mechanical Engineering'],
      student_id: 'STU004',
      phone_number: '+1234567901',
      is_verified: true,
      date_joined: '2023-01-20',
      last_updated: '2023-09-20',
      status: 'suspended',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '13',
      email: 'admin@university.edu',
      role: 'admin',
      first_name: 'System',
      last_name: 'Administrator',
      employee_id: 'ADMIN001',
      phone_number: '+1234567902',
      is_verified: true,
      date_joined: '2021-01-01',
      last_updated: '2023-10-01',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '14',
      email: 'dean@university.edu',
      role: 'dean',
      first_name: 'Academic',
      last_name: 'Dean',
      department: 'Computer Science',
      employee_id: 'DEAN001',
      phone_number: '+1234567903',
      is_verified: true,
      date_joined: '2021-02-01',
      last_updated: '2023-10-05',
      status: 'active',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  ]

  useEffect(() => {
    // Simulate API call to fetch users
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter users based on search, role, department, and status
  const filteredUsers = users.filter((user) => {
    let matchesQuery = true
    let matchesRole = true
    let matchesDepartment = true
    let matchesStatus = true

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesQuery =
        user.email.toLowerCase().includes(query) ||
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        (user.student_id && user.student_id.toLowerCase().includes(query)) ||
        (user.employee_id && user.employee_id.toLowerCase().includes(query))
    }

    if (selectedRole) {
      matchesRole = user.role === selectedRole
    }

    if (selectedDepartment && user.department) {
      matchesDepartment = user.department === departments.find((d) => d.id === selectedDepartment)?.name
    }

    if (selectedStatus) {
      matchesStatus = user.status === selectedStatus
    }

    return matchesQuery && matchesRole && matchesDepartment && matchesStatus
  })

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
    setSelectAll(!selectAll)
  }

  const handleAddUser = () => {
    setIsProcessing(true)

    // Validate inputs
    if (!newUser.email || !newUser.first_name || !newUser.last_name || !newUser.role) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      setIsProcessing(false)
      return
    }

    // Simulate API call to add user
    setTimeout(() => {
      setIsProcessing(false)
      setShowAddDialog(false)
      setNewUser({
        email: '',
        first_name: '',
        last_name: '',
        role: 'student',
        department: '',
        programmes: [],
        student_id: '',
        employee_id: '',
        phone_number: '',
        status: 'active',
      })

      toast({
        title: 'User Added',
        description: `${newUser.first_name} ${newUser.last_name} has been added successfully.`,
      })
    }, 1000)
  }

  const handleEditUser = () => {
    if (!currentUser) return
    
    setIsProcessing(true)

    // Simulate API call to update user
    setTimeout(() => {
      setIsProcessing(false)
      setShowEditDialog(false)
      setCurrentUser(null)

      toast({
        title: 'User Updated',
        description: `${currentUser.first_name} ${currentUser.last_name} has been updated successfully.`,
      })
    }, 1000)
  }

  const handleDeleteUser = (id: string) => {
    // Simulate API call to delete user
    const user = users.find((u) => u.id === id)
    
    if (user) {
      toast({
        title: 'User Deleted',
        description: `${user.first_name} ${user.last_name} has been deleted successfully.`,
      })
    }
  }

  const handleImportUsers = () => {
    if (!importFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a CSV file to import.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    // Simulate API call to import users
    setTimeout(() => {
      setIsProcessing(false)
      setShowImportDialog(false)
      setImportFile(null)

      toast({
        title: 'Users Imported',
        description: 'Users have been imported successfully.',
      })
    }, 2000)
  }

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'verify') => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No Users Selected',
        description: 'Please select at least one user to perform this action.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    // Simulate API call for bulk action
    setTimeout(() => {
      setIsProcessing(false)
      setSelectedUsers([])
      setSelectAll(false)

      const actionMap = {
        activate: 'activated',
        deactivate: 'deactivated',
        suspend: 'suspended',
        delete: 'deleted',
        verify: 'verified',
      }

      toast({
        title: 'Bulk Action Completed',
        description: `${selectedUsers.length} users have been ${actionMap[action]} successfully.`,
      })
    }, 1500)
  }

  const getStatusBadge = (status: 'active' | 'inactive' | 'suspended') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'inactive':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Inactive</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>
    }
  }

  const getRoleBadge = (role: 'student' | 'lecturer' | 'hod' | 'dean' | 'config_user' | 'admin') => {
    switch (role) {
      case 'student':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Student</Badge>
      case 'lecturer':
        return <Badge variant="outline" className="text-green-500 border-green-500">Lecturer</Badge>
      case 'hod':
        return <Badge variant="outline" className="text-purple-500 border-purple-500">HOD</Badge>
      case 'dean':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Dean</Badge>
      case 'config_user':
        return <Badge variant="outline" className="text-indigo-500 border-indigo-500">Config User</Badge>
      case 'admin':
        return <Badge variant="outline" className="text-red-500 border-red-500">Admin</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage users across the system</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import Users
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedRole(null)}>All Users</TabsTrigger>
          <TabsTrigger value="students" onClick={() => setSelectedRole('student')}>Students</TabsTrigger>
          <TabsTrigger value="lecturers" onClick={() => setSelectedRole('lecturer')}>Lecturers</TabsTrigger>
          <TabsTrigger value="hods" onClick={() => setSelectedRole('hod')}>HODs</TabsTrigger>
          <TabsTrigger value="admins" onClick={() => setSelectedRole('admin')}>Admins</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedDepartment || 'all'} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus || 'all'} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                {(searchQuery || selectedDepartment || selectedStatus || selectedRole) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedDepartment(null)
                      setSelectedStatus(null)
                      setSelectedRole(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear filters</span>
                  </Button>
                )}
              </div>
              
              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedUsers.length} selected
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Bulk Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                        Deactivate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
                        Suspend
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('verify')}>
                        Verify Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleBulkAction('delete')}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectAll} 
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all users"
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleSelectUser(user.id)}
                              aria-label={`Select ${user.first_name} ${user.last_name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                                <AvatarFallback>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.first_name} {user.last_name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.role === 'student' ? user.student_id : user.employee_id}
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{user.department || '-'}</TableCell>
                          <TableCell>{user.phone_number || '-'}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentUser(user)
                                    setShowEditDialog(true)
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                {!user.is_verified && (
                                  <DropdownMenuItem>
                                    Resend Verification
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: 'student' | 'lecturer' | 'hod' | 'dean' | 'config_user' | 'admin') => 
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                  <SelectItem value="hod">Head of Department</SelectItem>
                  <SelectItem value="dean">Dean</SelectItem>
                  <SelectItem value="config_user">Config User</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={newUser.department}
                onValueChange={(value) => setNewUser({ ...newUser, department: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {newUser.role === 'student' ? (
              <div className="grid gap-2">
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  value={newUser.student_id}
                  onChange={(e) => setNewUser({ ...newUser, student_id: e.target.value })}
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input
                  id="employee_id"
                  value={newUser.employee_id}
                  onChange={(e) => setNewUser({ ...newUser, employee_id: e.target.value })}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={newUser.phone_number}
                onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newUser.status}
                onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                  setNewUser({ ...newUser, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {currentUser && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details and status.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-first_name">First Name</Label>
                  <Input
                    id="edit-first_name"
                    value={currentUser.first_name}
                    onChange={(e) => setCurrentUser({ ...currentUser, first_name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-last_name">Last Name</Label>
                  <Input
                    id="edit-last_name"
                    value={currentUser.last_name}
                    onChange={(e) => setCurrentUser({ ...currentUser, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={currentUser.department || ''}
                  onValueChange={(value) => setCurrentUser({ ...currentUser, department: value })}
                >
                  <SelectTrigger id="edit-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {currentUser.role === 'student' ? (
                <div className="grid gap-2">
                  <Label htmlFor="edit-student_id">Student ID</Label>
                  <Input
                    id="edit-student_id"
                    value={currentUser.student_id || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, student_id: e.target.value })}
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="edit-employee_id">Employee ID</Label>
                  <Input
                    id="edit-employee_id"
                    value={currentUser.employee_id || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, employee_id: e.target.value })}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="edit-phone_number">Phone Number</Label>
                <Input
                  id="edit-phone_number"
                  value={currentUser.phone_number || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, phone_number: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentUser.status}
                  onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                    setCurrentUser({ ...currentUser, status: value })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-verified">Email Verified</Label>
                  <Switch
                    id="edit-verified"
                    checked={currentUser.is_verified}
                    onCheckedChange={(checked) => 
                      setCurrentUser({ ...currentUser, is_verified: checked })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Import Users Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Users</DialogTitle>
            <DialogDescription>
              Upload a CSV file to bulk import users into the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-md border border-dashed p-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drag & drop your CSV file here</p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".csv"
                  className="max-w-xs"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImportFile(e.target.files[0])
                    }
                  }}
                />
              </div>
            </div>
            {importFile && (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{importFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(importFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImportFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">CSV Format Requirements:</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>First row must contain column headers</li>
                <li>Required columns: email, first_name, last_name, role</li>
                <li>Optional columns: department, student_id, employee_id, phone_number</li>
                <li>Role must be one of: student, lecturer, hod, dean, config_user, admin</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Import Options:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="update-existing" />
                  <Label htmlFor="update-existing">Update existing users if email matches</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="send-welcome" />
                  <Label htmlFor="send-welcome">Send welcome emails to new users</Label>
                </div>
              </div>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> All imported users will be set to 'inactive' status by default and will need to verify their email address.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportUsers} disabled={isProcessing || !importFile}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Users'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
