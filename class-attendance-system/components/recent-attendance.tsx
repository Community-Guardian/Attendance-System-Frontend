import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentAttendanceData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.j@example.com",
    course: "Mathematics 101",
    status: "Present",
    time: "10:00 AM",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.s@example.com",
    course: "Physics 202",
    status: "Absent",
    time: "11:30 AM",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    course: "Chemistry 301",
    status: "Late",
    time: "2:15 PM",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana.p@example.com",
    course: "Biology 401",
    status: "Present",
    time: "3:45 PM",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    email: "ethan.h@example.com",
    course: "Computer Science 501",
    status: "Present",
    time: "5:00 PM",
  },
]

export function RecentAttendance() {
  return (
    <div className="space-y-8">
      {recentAttendanceData.map((record) => (
        <div key={record.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${record.name}.png`} alt={record.name} />
            <AvatarFallback>
              {record.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{record.name}</p>
            <p className="text-sm text-muted-foreground">{record.course}</p>
          </div>
          <div className="ml-auto font-medium">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                record.status === "Present"
                  ? "bg-green-100 text-green-800"
                  : record.status === "Absent"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {record.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

