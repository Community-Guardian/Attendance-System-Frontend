"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCourses } from "@/context/CoursesContext";
import { useUser } from "@/context/userContext";
import { Department } from "@/types/courses";
import { User } from "@/types/index";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import dropdown components

export function DepartmentManagement() {
  const {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useCourses();

  const { fetchUser, user } = useUser(); // Get user data from context
  const [hods, setHods] = useState<User[]>([]); // State for storing HoDs

  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({ name: "", headOfDepartment: "" });

  useEffect(() => {
    fetchDepartments();
    fetchUser(); // Fetch all users
  }, []);

  useEffect(() => {
    if (user && user.role === "hod") {
      setHods((prev) => [...prev, user]); // Add HoD users to state
    }
  }, [user]);

  const handleAddDepartment = async () => {
    if (newDepartment.name && newDepartment.headOfDepartment) {
      await createDepartment(newDepartment);
      setNewDepartment({ name: "", headOfDepartment: "" });
      fetchDepartments();
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    await deleteDepartment(id);
    fetchDepartments();
  };

  return (
    <div className="space-y-4">
      {loading && <p>Loading departments...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Head of Department</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>{dept.name}</TableCell>
              <TableCell>
                {hods.find((hod) => hod.id === dept.hod)?.name || "Unknown"}
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteDepartment(dept.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Department</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="head" className="text-right">
                Head of Department
              </Label>
              <Select
                onValueChange={(value) => setNewDepartment({ ...newDepartment, headOfDepartment: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Head of Department" />
                </SelectTrigger>
                <SelectContent>
                  {hods.map((hod) => (
                    <SelectItem key={hod.id} value={hod.id}>
                      {hod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddDepartment}>Add Department</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
