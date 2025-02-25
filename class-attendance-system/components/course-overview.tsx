import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StudentAttendanceResponse } from "@/types";

interface CourseOverviewProps {
  attendanceData?: StudentAttendanceResponse; // Make it optional to handle missing props
}

export function CourseOverview({ attendanceData }: CourseOverviewProps) {
  const courses = attendanceData?.courses ?? []; // Default to an empty array if undefined

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left text-sm font-semibold">Course</TableHead>
            <TableHead className="text-center text-sm font-semibold">Avg. Attendance</TableHead>
            <TableHead className="text-right text-sm font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course.course_id} className="hover:bg-muted">
                <TableCell className="py-2 text-left">{course.course_name}</TableCell>
                <TableCell className="py-2 text-center">{course.attendance_percentage}%</TableCell>
                <TableCell className="py-2 text-right">
                  <Button size="sm" className="text-xs">View Details</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="py-4 text-center text-sm text-muted-foreground">
                No courses available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
