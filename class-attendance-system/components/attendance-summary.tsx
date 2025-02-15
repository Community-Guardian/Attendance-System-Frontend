import { Progress } from "@/components/ui/progress"

const courses = [
  { name: "Mathematics 101", attendance: 95 },
  { name: "Physics 202", attendance: 88 },
  { name: "Chemistry 301", attendance: 92 },
  { name: "Biology 401", attendance: 85 },
  { name: "Computer Science 501", attendance: 98 },
]

export function AttendanceSummary() {
  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.name} className="space-y-2">
          <div className="flex justify-between">
            <span>{course.name}</span>
            <span>{course.attendance}%</span>
          </div>
          <Progress value={course.attendance} />
        </div>
      ))}
    </div>
  )
}

