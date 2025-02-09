import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      // Find the staff by email
      const staff = await prisma.staff.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!staff) {
        return res
          .status(404)
          .json({ error: "Staff with this email does not exist" });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, staff.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password", status: 401 });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" } // Set token expiry time in 30days
      );

      // Password is valid, return success with token
      return res.status(200).json({
        message: "Login successful",
        status: 200,
        token: token,
        id: staff.id,
      });
    } else {
      // Handle other HTTP methods if needed
      return res.status(405).json({
        message: "Method Not Allowed",
        status: 405,
        error: "Only POST method is allowed for this endpoint",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: null,
      status: 500,
      error: "An error occurred on the server. Please try again later!",
    });
  }
}
