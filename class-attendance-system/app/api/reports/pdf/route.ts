import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"

export async function POST(req: Request): Promise<Response> {
  try {
    const { history } = await req.json()

    if (!Array.isArray(history)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    // Use an async function to properly return the response
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on("data", (chunk) => chunks.push(chunk))

      doc.on("end", () => resolve(Buffer.concat(chunks)))

      doc.on("error", (err) => reject(err))

      // PDF Title
      doc.fontSize(20).text("Attendance History Report", { align: "center" }).moveDown(2)

      // Table headers
      doc
        .fontSize(12)
        .text("Date", 50, 120)
        .text("Course", 150, 120)
        .text("Session Time", 250, 120)
        .text("Verification", 400, 120)

      let y = 150
      const lineHeight = 25

      history.forEach((record: any) => {
        const session = record.session || {}
        const startTime = session.start_time ? new Date(session.start_time).toLocaleTimeString() : "N/A"
        const endTime = session.end_time ? new Date(session.end_time).toLocaleTimeString() : "N/A"
        const date = record.timestamp ? new Date(record.timestamp).toLocaleDateString() : "N/A"

        // Add new page if needed
        if (y > 700) {
          doc.addPage()
          y = 50
        }

        doc
          .text(date, 50, y)
          .text(session.course?.name || "N/A", 150, y)
          .text(`${startTime} - ${endTime}`, 250, y)
          .text(record.signed_by_lecturer ? "Verified" : "Pending", 400, y)

        y += lineHeight
      })

      doc.end()
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=attendance_history.pdf",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate PDF file" }, { status: 500 })
  }
}
