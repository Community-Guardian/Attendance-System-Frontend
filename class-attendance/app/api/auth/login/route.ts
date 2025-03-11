import { type NextRequest, NextResponse } from "next/server"

// Dummy user data
const users = [
  {
    email: "student@example.com",
    password: "password",
    role: "student",
    id: "student1",
    first_name: "Alice",
    last_name: "Johnson",
    is_verified: true,
  },
  {
    email: "lecturer@example.com",
    password: "password",
    role: "lecturer",
    id: "lecturer1",
    first_name: "John",
    last_name: "Doe",
    is_verified: true,
  },
  {
    email: "hod@example.com",
    password: "password",
    role: "hod",
    id: "hod1",
    first_name: "Robert",
    last_name: "Smith",
    is_verified: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user with matching credentials
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Return dummy tokens and user data
    return NextResponse.json({
      access: "dummy_access_token",
      refresh: "dummy_refresh_token",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        is_verified: user.is_verified,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

