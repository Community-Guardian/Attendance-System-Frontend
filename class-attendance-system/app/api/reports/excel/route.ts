import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(req: Request) {
  try {
    const { history } = await req.json()

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()

    // Convert history data to worksheet format
    const wsData = history.map((record: any) => ({
      Date: new Date(record.timestamp).toLocaleDateString(),
      Time: new Date(record.timestamp).toLocaleTimeString(),
      Course: record.session.course?.name || "N/A",
      "Session Time": `${new Date(record.session?.start_time || "").toLocaleTimeString()} - ${new Date(record.session?.end_time || "").toLocaleTimeString()}`,
      "Verified by Lecturer": record.signed_by_lecturer ? "Yes" : "No",
    }))

    const ws = XLSX.utils.json_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, "Attendance History")

    // Generate buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=attendance_history.xlsx",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate Excel file" }, { status: 500 })
  }
}

