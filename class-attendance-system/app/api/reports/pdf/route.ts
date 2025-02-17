import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"

export async function POST(req: Request) {
  try {
    const { history } = await req.json()

    if (!Array.isArray(history)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Create PDF document
    const doc = new PDFDocument()
    const chunks: Uint8Array[] = []

    doc.on("data", (chunk) => chunks.push(chunk))

    // PDF Title
    doc.fontSize(20).text("Attendance History Report", { align: "center" }).moveDown()

    // Table headers
    doc
      .fontSize(12)
      .text("Date", 50, 120)
      .text("Course", 150, 120)
      .text("Session Time", 250, 120)
      .text("Verification", 400, 120)

    let y = 150
    history.forEach((record: any) => {
      const session = record.session || {}
      const startTime = session.start_time ? new Date(session.start_time).toLocaleTimeString() : "N/A"
      const endTime = session.end_time ? new Date(session.end_time).toLocaleTimeString() : "N/A"
      const date = record.timestamp ? new Date(record.timestamp).toLocaleDateString() : "N/A"

      doc
        .text(date, 50, y)
        .text(session.course?.name || "N/A", 150, y)
        .text(`${startTime} - ${endTime}`, 250, y)
        .text(record.signed_by_lecturer ? "Verified" : "Pending", 400, y)

      y += 30
    })

    doc.end()

    return new Promise((resolve) => {
      doc.on("end", () => {
        const buffer = new Uint8Array(chunks.reduce((acc, chunk) => {
          const newAcc = new Uint8Array(acc.length + chunk.length)
          newAcc.set(acc, 0)
          newAcc.set(chunk, acc.length)
          return newAcc
        }, new Uint8Array()))
        resolve(
          new NextResponse(buffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": "attachment; filename=attendance_history.pdf",
            },
          }),
        )
      })
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate PDF file" }, { status: 500 })
  }
}
