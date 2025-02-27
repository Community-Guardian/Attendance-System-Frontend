"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext"; // Import UserContext hook
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/types";

export function UserManagement() {
  const { user, fetchUser, fetchUserById, updateUser, deleteUser, loading, error } = useUser();
  const [users, setUsers] = useState<User[]>([]); // Local state for displaying users
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "student",
  });

  useEffect(() => {
    fetchUser(); // Fetch users when component mounts
  }, []);

  useEffect(() => {
    if (user) {
      setUsers([user]); // Update local state when user changes
    }
  }, [user]);

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      // Simulate adding a user (backend should handle ID assignment)
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
      setNewUser({ name: "", email: "", role: "student" });
    }
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id.toString()); // Ensure ID is a string for API call
    setUsers(users.filter((user) => user.id !== id));
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users: {error}</p>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New User</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value: "student" | "lecturer" | "hod" | "dp_academics" | "config") =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                  <SelectItem value="hod">Head of Department</SelectItem>
                  <SelectItem value="dp_academics">DP Academics</SelectItem>
                  <SelectItem value="config">Config User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddUser}>Add User</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
