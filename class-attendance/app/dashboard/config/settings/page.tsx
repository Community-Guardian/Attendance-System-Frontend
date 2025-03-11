'use client'

import { useState } from 'react'
import { Clock, Globe, Loader2, Save, SettingsIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { SystemSetting } from '@/types/config'

export default function SettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // Mock system settings
  const [systemSettings, setSystemSettings] = useState<SystemSetting & {
    attendance_cutoff_minutes: number;
    allow_makeup_classes: boolean;
    max_class_duration: number;
    enable_facial_recognition: boolean;
    enable_geolocation: boolean;
    default_timezone: string;
    email_notifications: boolean;
    sms_notifications: boolean;
    maintenance_mode: boolean;
    maintenance_message: string;
    academic_year: string;
    semester: string;
    cat_week_start_date: string;
    cat_week_end_date: string;
  }>({
    id: 'settings1',
    attendance_radius: 100,
    attendance_cutoff_time: '00:15:00',
    attendance_cutoff_minutes: 15,
    allow_makeup_classes: true,
    max_class_duration: 180,
    enable_facial_recognition: true,
    enable_geolocation: true,
    default_timezone: 'Africa/Nairobi',
    email_notifications: true,
    sms_notifications: false,
    maintenance_mode: false,
    maintenance_message: 'The system is currently undergoing maintenance. Please try again later.',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z',
    last_modified_by: 'admin',
    academic_year: '2023-2024',
    semester: '1',
    cat_week_start_date: '2023-11-20',
    cat_week_end_date: '2023-11-26',
  })

  const handleSaveSettings = () => {
    setIsSaving(true)
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false)
      
      toast({
        title: 'Settings Saved',
        description: 'System settings have been updated successfully.',
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure global settings for the attendance system
        </p>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="academic">Academic Calendar</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Settings</CardTitle>
              <CardDescription>
                Configure attendance tracking parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="attendanceRadius">Attendance Radius (meters)</Label>
                  <Input
                    id="attendanceRadius"
                    type="number"
                    min="10"
                    max="1000"
                    value={systemSettings.attendance_radius}
                    onChange={(e) => setSystemSettings({ 
                      ...systemSettings, 
                      attendance_radius: parseInt(e.target.value) || 0 
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum distance from class location for valid attendance
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="attendanceCutoff">Attendance Cutoff (minutes)</Label>
                  <Input
                    id="attendanceCutoff"
                    type="number"
                    min="0"
                    max="60"
                    value={systemSettings.attendance_cutoff_minutes}
                    onChange={(e) => {
                      const minutes = parseInt(e.target.value) || 0
                      const timeString = `00:${minutes.toString().padStart(2, '0')}:00`
                      setSystemSettings({ 
                        ...systemSettings, 
                        attendance_cutoff_minutes: minutes,
                        attendance_cutoff_time: timeString
                      })
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time after class start when attendance is marked as late
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxClassDuration">Maximum Class Duration (minutes)</Label>
                  <Input
                    id="maxClassDuration"
                    type="number"
                    min="30"
                    max="480"
                    value={systemSettings.max_class_duration}
                    onChange={(e) => setSystemSettings({ 
                      ...systemSettings, 
                      max_class_duration: parseInt(e.target.value) || 0 
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum duration for a single class session
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowMakeup">Allow Makeup Classes</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable scheduling of makeup classes
                    </p>
                  </div>
                  <Switch
                    id="allowMakeup"
                    checked={systemSettings.allow_makeup_classes}
                    onCheckedChange={(checked) => setSystemSettings({ 
                      ...systemSettings, 
                      allow_makeup_classes: checked 
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableFacial">Enable Facial Recognition</Label>
                    <p className="text-xs text-muted-foreground">
                      Use facial recognition for attendance verification
                    </p>
                  </div>
                  <Switch
                    id="enableFacial"
                    checked={systemSettings.enable_facial_recognition}
                    onCheckedChange={(checked) => setSystemSettings({ 
                      ...systemSettings, 
                      enable_facial_recognition: checked 
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableGeo">Enable Geolocation</Label>
                    <p className="text-xs text-muted-foreground">
                      Use geolocation for attendance verification
                    </p>
                  </div>
                  <Switch
                    id="enableGeo"
                    checked={systemSettings.enable_geolocation}
                    onCheckedChange={(checked) => setSystemSettings({ 
                      ...systemSettings, 
                      enable_geolocation: checked 
                    })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Calendar Settings</CardTitle>
              <CardDescription>
                Configure academic year, semesters, and CAT weeks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={systemSettings.academic_year}
                    onValueChange={(value) => setSystemSettings({ 
                      ...systemSettings, 
                      academic_year: value 
                    })}
                  >
                    <SelectTrigger id="academicYear">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                      <SelectItem value="2021-2022">2021-2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Select
                    value={systemSettings.semester}
                    onValueChange={(value) => setSystemSettings({ 
                      ...systemSettings, 
                      semester: value 
                    })}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                      <SelectItem value="3">Semester 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>CAT Week</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="catStartDate" className="text-xs text-muted-foreground">
                      Start Date
                    </Label>
                    <Input
                      id="catStartDate"
                      type="date"
                      value={systemSettings.cat_week_start_date}
                      onChange={(e) => setSystemSettings({ 
                        ...systemSettings, 
                        cat_week_start_date: e.target.value 
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="catEndDate" className="text-xs text-muted-foreground">
                      End Date
                    </Label>
                    <Input
                      id="catEndDate"
                      type="date"
                      value={systemSettings.cat_week_end_date}
                      onChange={(e) => setSystemSettings({ 
                        ...systemSettings, 
                        cat_week_end_date: e.target.value 
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={systemSettings.email_notifications}
                    onCheckedChange={(checked) => setSystemSettings({ 
                      ...systemSettings, 
                      email_notifications: checked 
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Send notifications via SMS
                    </p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={systemSettings.sms_notifications}
                    onCheckedChange={(checked) => setSystemSettings({ 
                      ...systemSettings, 
                      sms_notifications: checked 
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notification Events</Label>
                <div className="space-y-2">
                  {[
                    { id: 'attendance_open', label: 'Attendance Session Opened' },
                    { id: 'attendance_closed', label: 'Attendance Session Closed' },
                    { id: 'attendance_reminder', label: 'Attendance Reminder' },
                    { id: 'timetable_changes', label: 'Timetable Changes' },
                    { id: 'cat_week_reminder', label: 'CAT Week Reminder' },
                  ].map((event) => (
                    <div key={event.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={event.id}
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor={event.id}>{event.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure general system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select
                    value={systemSettings.default_timezone}
                    onValueChange={(value) => setSystemSettings({ 
                      ...systemSettings, 
                      default_timezone: value 
                    })}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                      <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                      <SelectItem value="Africa/Cairo">Africa/Cairo (EET)</SelectItem>
                      <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Put the system in maintenance mode
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={systemSettings.maintenance_mode}
                    onCheckedChange={(checked) => setSystemSettings({ 
                      ...systemSettings, 
                      maintenance_mode: checked 
                    })}
                  />
                </div>

                {systemSettings.maintenance_mode && (
                  <div className="grid gap-2">
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Textarea
                      id="maintenanceMessage"
                      rows={3}
                      value={systemSettings.maintenance_message}
                      onChange={(e) => setSystemSettings({ 
                        ...systemSettings, 
                        maintenance_message: e.target.value 
                      })}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
