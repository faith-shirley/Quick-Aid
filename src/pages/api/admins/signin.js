import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      // Find the admin by email
      const admin = await prisma.admin.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!admin) {
        return res
          .status(404)
          .json({ error: "Admin with this email does not exist" });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" } // Set token expiry time in 1h
        // { expiresIn: "2m" } // Set token expiry time in 2m
      );

      // Password is valid, return success with token
      return res.status(200).json({
        message: "Login successful",
        status: 200,
        token: token,
        id: admin.id,
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
    console.log(error);
    return res.status(500).json({
      message: null,
      status: 500,
      error: "An error occurred on the server. Please try again later!",
    });
  }
}
