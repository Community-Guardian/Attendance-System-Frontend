'use client'

import { useState, useRef, useEffect } from 'react'
import { AxiosError } from 'axios'
import { Download, Edit, Filter, Loader2, MoreHorizontal, Plus, Search, Trash2, Upload, UserPlus, X } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Pagination } from '@/components/ui/pagination'
import { ApiErrorResponse, User, DjangoPaginatedResponse, UserRole } from '@/types'
import ApiService from '@/handler/ApiService'
import authManager from '@/handler/AuthManager'
import * as XLSX from 'xlsx';

interface ImportResponse {
  created_users: User[];
  errors: Array<{
    data: {
      email: string;
      role: string;
      first_name: string;
      last_name: string;
      password1?: string;
      password2?: string;
    };
    errors: {
      [key: string]: string[];
    };
  }>;
}

interface UserImportData {
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone_number?: string;
  student_id?: string;
  employee_id?: string;
}

const ROLES: UserRole[] = ['student', 'lecturer', 'hod', 'dean', 'config_user', 'admin']
type RoleFilter = UserRole | 'all'

const PAGE_SIZES = [10, 25, 50, 100]

export default function UserManagementPage() {
  // State management
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newUserData, setNewUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'student' as UserRole,
    phone_number: '',
    student_id: '',
    employee_id: '',
  })

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1) // Reset to first page when search changes
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery,selectedRole])

  // API hooks
  const { useFetchData, useAddItem, useUpdateItem, useDeleteItem, } = useApi<User, User>(ApiService.USER_URL, pageSize)
  
  // For bulk actions
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Fetch users with filters
  const { data: usersData, isLoading : isLoadingUsers, refetch } = useFetchData(page, {
    email: debouncedSearch,
    role: selectedRole === 'all' ? '' : selectedRole,
    all:true,
  })

  // Mutations
  const { mutate: createUserMutation, isPending: isCreating } = useAddItem
  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateItem
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteItem

  // Handlers
  const handleAddUser = () => {
    createUserMutation(newUserData, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewUserData({
          email: '',
          first_name: '',
          last_name: '',
          role: 'student',
          phone_number: '',
          student_id: '',
          employee_id: '',
        })
        toast.success('User created successfully')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create user')
      }
    })
  }

  const handleEditUser = () => {
    if (!currentUser?.id) return
    updateUserMutation({ 
      id: currentUser.id, 
      item: currentUser 
    }, {
      onSuccess: () => {
        setShowEditDialog(false)
        setCurrentUser(null)
        toast.success('User updated successfully')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update user')
      }
    })
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId, {
        onSuccess: () => {
          toast.success('User deleted successfully')
        },
        onError: (error) => {
          toast.error(error.message|| 'Failed to delete user')
        }
      })
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      setIsBulkProcessing(true)
      Promise.all(selectedUsers.map(id => deleteUser(id)))
        .then(() => {
          setSelectedUsers([])
          toast.success('Users deleted successfully')
        })
        .catch((error) => {
          toast.error('Failed to delete some users')
        })
        .finally(() => {
          setIsBulkProcessing(false)
        })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase()
      if (fileType !== 'json' && fileType !== 'xlsx' && fileType !== 'xls') {
        toast.error('Please upload a JSON or Excel file')
        return
      }
      setImportFile(file)
    }
  }

  const parseExcelFile = (file: File): Promise<UserImportData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const records = XLSX.utils.sheet_to_json(firstSheet)
          
          const users = records.map((record: any) => ({
            email: record.email,
            role: record.role?.toLowerCase() || 'student',
            first_name: record.first_name || record.firstName || '',
            last_name: record.last_name || record.lastName || '',
            phone_number: record.phone_number || record.phoneNumber || '',
            student_id: record.student_id || record.studentId || '',
            employee_id: record.employee_id || record.employeeId || ''
          }))
          
          resolve(users)
        } catch (error) {
          reject(new Error('Failed to parse Excel file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsBinaryString(file)
    })
  }

  const parseJSONFile = (file: File): Promise<UserImportData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const users = JSON.parse(e.target?.result as string)
          if (!Array.isArray(users)) {
            reject(new Error('JSON file must contain an array of users'))
            return
          }
          resolve(users)
        } catch (error) {
          reject(new Error('Failed to parse JSON file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  const validateUsers = (users: UserImportData[]): string[] => {
    const errors: string[] = []
    
    users.forEach((user, index) => {
      if (!user.email) errors.push(`Row ${index + 1}: Email is required`)
      if (!ROLES.includes(user.role)) errors.push(`Row ${index + 1}: Invalid role`)
      if (!user.first_name) errors.push(`Row ${index + 1}: First name is required`)
      if (!user.last_name) errors.push(`Row ${index + 1}: Last name is required`)
    })
    
    return errors
  }

  const handleImportUsers = async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      const users = await (importFile.name.toLowerCase().endsWith('.json') 
        ? parseJSONFile(importFile) 
        : parseExcelFile(importFile));

      // Use AuthManager's mass register instead of direct API call
      const response = await authManager.massRegister(users);

      // Handle successful creations
      if (response.created_users.length > 0) {
        toast.success(`Successfully created ${response.created_users.length} users`);
      }

      // Handle errors
      if (response.errors.length > 0) {
        const errorMessages = response.errors.map((error : any) => 
          `Failed to create user ${error.data.email}: ${Object.values(error.errors).flat().join(', ')}`
        );
        
        toast.error(`Failed to create ${response.errors.length} users. Check console for details.`);
        console.error('User creation errors:', errorMessages);
      }

      // Reset form and refresh data
      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowImportDialog(false);
      refetch();

    } catch (error) {
      toast.error('Failed to import users');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  }

  const handleExportUsers = async () => {
    setIsExporting(true)
    try {
      const { data: usersData } = await useFetchData(1, { 
        page_size: 1000,
        all: true 
      })

      if (!usersData?.results) {
        throw new Error('No users data available')
      }

      const exportData = usersData.results.map((user: User) => ({
        'Email': user.email,
        'First Name': user.first_name,
        'Last Name': user.last_name,
        'Role': user.role,
        'Phone Number': user.phone_number || '',
        'Student ID': user.student_id || '',
        'Employee ID': user.employee_id || '',
        'Status': user.is_verified ? 'Verified' : 'Pending'
      }))

      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
      
      const fileName = `users_export_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)
      
      toast.success('Users exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export users')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4 p-8">
      {/* Header with search and filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users using email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Select 
            value={selectedRole} 
            onValueChange={(value: RoleFilter) => setSelectedRole(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowImportDialog(true)}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportUsers}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
          {selectedUsers.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isBulkProcessing}
            >
              {isBulkProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedUsers.length})
                </>
              )}
            </Button>
          )}
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedUsers.length === (usersData?.results?.length || 0)}
                    onCheckedChange={(checked) => {
                      if (checked && usersData?.results) {
                        setSelectedUsers(usersData.results.map(user => user.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingUsers ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : usersData?.results?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                usersData?.results?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers([...selectedUsers, user.id])
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={user.registered_face} />
                        <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.student_id || user.employee_id || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_verified ? "success" : "warning"}>
                        {user.is_verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentUser(user)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
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
        </CardContent>
      </Card>

      {/* Pagination */}
      {usersData && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center space-x-2">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setPage(1) // Reset to first page when page size changes
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, usersData.count)} of {usersData.count} entries
            </p>
          </div>
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(usersData.count / pageSize)}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Users</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <span>Upload a JSON or Excel file containing user data.</span>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open('/templates/user_import_template.xlsx')}
                    className="text-xs"
                  >
                    Download Template
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json,.xlsx,.xls"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImportUsers} 
              disabled={!importFile || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. The user will receive an email to set their password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newUserData.first_name}
                  onChange={(e) => setNewUserData({ ...newUserData, first_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newUserData.last_name}
                  onChange={(e) => setNewUserData({ ...newUserData, last_name: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newUserData.role} onValueChange={(value) => setNewUserData({ ...newUserData, role: value as UserRole })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newUserData.phone_number}
                onChange={(e) => setNewUserData({ ...newUserData, phone_number: e.target.value })}
              />
            </div>
            {newUserData.role === 'student' ? (
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={newUserData.student_id}
                  onChange={(e) => setNewUserData({ ...newUserData, student_id: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={newUserData.employee_id}
                  onChange={(e) => setNewUserData({ ...newUserData, employee_id: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={currentUser.first_name}
                    onChange={(e) => setCurrentUser({ ...currentUser, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={currentUser.last_name}
                    onChange={(e) => setCurrentUser({ ...currentUser, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editPhone">Phone Number</Label>
                <Input
                  id="editPhone"
                  value={currentUser.phone_number}
                  onChange={(e) => setCurrentUser({ ...currentUser, phone_number: e.target.value })}
                />
              </div>
              {currentUser.role === 'student' ? (
                <div>
                  <Label htmlFor="editStudentId">Student ID</Label>
                  <Input
                    id="editStudentId"
                    value={currentUser.student_id}
                    onChange={(e) => setCurrentUser({ ...currentUser, student_id: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="editEmployeeId">Employee ID</Label>
                  <Input
                    id="editEmployeeId"
                    value={currentUser.employee_id}
                    onChange={(e) => setCurrentUser({ ...currentUser, employee_id: e.target.value })}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
