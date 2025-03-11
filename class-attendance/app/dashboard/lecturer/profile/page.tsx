"use client"

import { useState } from "react"
import { Camera, Mail, Phone, MapPin, Building, BookOpen, Calendar, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function LecturerProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  // Dummy lecturer data
  const [lecturerData, setLecturerData] = useState({
    name: "Dr. Jane Smith",
    email: "jane.smith@university.edu",
    phone: "+254 712 345 678",
    department: "Computer Science",
    faculty: "Information Technology",
    office: "CS Building, Room 305",
    bio: "Professor of Computer Science with over 10 years of teaching experience. Specializes in Database Systems, Software Engineering, and Computer Networks.",
    expertise: ["Database Systems", "Software Engineering", "Computer Networks", "Artificial Intelligence"],
    education: [
      {
        degree: "PhD in Computer Science",
        institution: "Stanford University",
        year: "2010",
      },
      {
        degree: "MSc in Computer Science",
        institution: "MIT",
        year: "2006",
      },
      {
        degree: "BSc in Computer Science",
        institution: "University of Nairobi",
        year: "2004",
      },
    ],
    courses: [
      {
        code: "CS301",
        name: "Database Systems",
        semester: "Fall 2023",
        students: 40,
      },
      {
        code: "CS302",
        name: "Software Engineering",
        semester: "Fall 2023",
        students: 45,
      },
      {
        code: "CS303",
        name: "Computer Networks",
        semester: "Fall 2023",
        students: 35,
      },
    ],
    schedule: [
      {
        day: "Monday",
        time: "9:00 AM - 11:00 AM",
        course: "Database Systems",
        location: "CS Building, Room 101",
      },
      {
        day: "Monday",
        time: "2:00 PM - 4:00 PM",
        course: "Software Engineering",
        location: "Engineering Block, Room 203",
      },
      {
        day: "Tuesday",
        time: "11:00 AM - 1:00 PM",
        course: "Computer Networks",
        location: "CS Building, Room 105",
      },
    ],
  })

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="academic">Academic Details</TabsTrigger>
          <TabsTrigger value="schedule">Teaching Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic personal and contact details</CardDescription>
              </div>
              <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                <div className="relative">
                  <div className="h-32 w-32 overflow-hidden rounded-full bg-muted">
                    <img
                      src="/placeholder.svg?height=128&width=128"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full bg-background"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Upload photo</span>
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={lecturerData.name}
                          onChange={(e) => setLecturerData({ ...lecturerData, name: e.target.value })}
                        />
                      ) : (
                        <div className="rounded-md border px-3 py-2">{lecturerData.name}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={lecturerData.email}
                          onChange={(e) => setLecturerData({ ...lecturerData, email: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center rounded-md border px-3 py-2">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          {lecturerData.email}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={lecturerData.phone}
                          onChange={(e) => setLecturerData({ ...lecturerData, phone: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center rounded-md border px-3 py-2">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          {lecturerData.phone}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office">Office</Label>
                      {isEditing ? (
                        <Input
                          id="office"
                          value={lecturerData.office}
                          onChange={(e) => setLecturerData({ ...lecturerData, office: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center rounded-md border px-3 py-2">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          {lecturerData.office}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={lecturerData.bio}
                        onChange={(e) => setLecturerData({ ...lecturerData, bio: e.target.value })}
                        rows={4}
                      />
                    ) : (
                      <div className="rounded-md border px-3 py-2">{lecturerData.bio}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Department Information</CardTitle>
              <CardDescription>Your academic department and faculty details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <div className="flex items-center rounded-md border px-3 py-2">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    {lecturerData.department}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <div className="flex items-center rounded-md border px-3 py-2">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    {lecturerData.faculty}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Your academic qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturerData.education.map((edu, index) => (
                  <div key={index} className="rounded-md border p-4">
                    <div className="font-medium">{edu.degree}</div>
                    <div className="text-sm text-muted-foreground">
                      {edu.institution}, {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
              <CardDescription>Your specialized fields and research interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lecturerData.expertise.map((area, index) => (
                  <div key={index} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {area}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Current Courses</CardTitle>
              <CardDescription>Courses you are currently teaching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturerData.courses.map((course, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">
                        {course.name} ({course.code})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course.semester} • {course.students} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Schedule</CardTitle>
              <CardDescription>Your weekly teaching timetable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturerData.schedule.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{item.day}</p>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                      <p className="text-sm">{item.course}</p>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

