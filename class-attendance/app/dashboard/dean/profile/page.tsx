import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DeanProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4 lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Manage your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback>DW</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Dr. William Chen</h3>
              <p className="text-sm text-muted-foreground">Dean of Faculty</p>
              <p className="text-sm text-muted-foreground">Faculty of Science & Technology</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Change Avatar
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Update your account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="William" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Chen" />
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" defaultValue="Dr." />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employee-id">Employee ID</Label>
                    <Input id="employee-id" defaultValue="D-2023-001" readOnly />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea 
                    id="bio" 
                    defaultValue="Dr. William Chen is the Dean of the Faculty of Science & Technology with over 20 years of experience in academic leadership and research in Computer Science."
                    rows={4}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="william.chen@university.edu" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="office">Office Location</Label>
                    <Input id="office" defaultValue="Science Building, Room 405" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="office-hours">Office Hours</Label>
                    <Input id="office-hours" defaultValue="Monday & Wednesday, 10AM-12PM" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assistant">Administrative Assistant</Label>
                  <Input id="assistant" defaultValue="Sarah Johnson (sarah.johnson@university.edu)" />
                </div>
              </TabsContent>
              
              <TabsContent value="academic" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" defaultValue="Computer Science, Machine Learning" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Faculty</Label>
                    <Input id="faculty" defaultValue="Science & Technology" readOnly />
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="appointment">Date of Appointment</Label>
                    <Input id="appointment" type="date" defaultValue="2023-01-15" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="term">Term End Date</Label>
                    <Input id="term" type="date" defaultValue="2026-01-14" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="achievements">Academic Achievements</Label>
                  <Textarea 
                    id="achievements" 
                    defaultValue="- Ph.D. in Computer Science, Stanford University
- Published over 50 research papers in leading journals
- Awarded Faculty Excellence Award (2020)
- Chair of University Academic Committee (2021-2022)"
                    rows={5}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
