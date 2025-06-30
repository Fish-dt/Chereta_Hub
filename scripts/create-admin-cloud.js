// This script helps you create admin users in your cloud MongoDB
// Run this in your browser console or use it as a reference

const createAdminUser = async () => {
  const adminData = {
    email: "admin@auctionhub.com",
    password: "admin123",
    firstName: "Super",
    lastName: "Admin",
    role: "admin",
    secretKey: "SUPER_SECRET_ADMIN_KEY_2024",
  }

  try {
    const response = await fetch("/api/admin/create-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    })

    const result = await response.json()

    if (response.ok) {
      console.log("✅ Super Admin created successfully!")
      console.log("📧 Email: admin@auctionhub.com")
      console.log("🔑 Password: admin123")
    } else {
      console.error("❌ Error:", result.error)
    }
  } catch (error) {
    console.error("❌ Network error:", error)
  }
}

const createModeratorUser = async () => {
  const moderatorData = {
    email: "moderator@auctionhub.com",
    password: "mod123",
    firstName: "Sample",
    lastName: "Moderator",
    role: "moderator",
    secretKey: "SUPER_SECRET_ADMIN_KEY_2024",
  }

  try {
    const response = await fetch("/api/admin/create-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moderatorData),
    })

    const result = await response.json()

    if (response.ok) {
      console.log("✅ Moderator created successfully!")
      console.log("📧 Email: moderator@auctionhub.com")
      console.log("🔑 Password: mod123")
    } else {
      console.error("❌ Error:", result.error)
    }
  } catch (error) {
    console.error("❌ Network error:", error)
  }
}

// Run these functions
console.log("Creating admin users...")
createAdminUser()
createModeratorUser()
