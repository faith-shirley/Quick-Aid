import prisma from "../../../../lib/prisma";
const bcrypt = require("bcryptjs");

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const data = req.body;

      const email = data.email.toLowerCase();

      // Check if the user already exists with the given email
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Hash the user's password before storing it
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create a new user in the database
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: email,
          phone: data.phone,
          password: hashedPassword,
        },
      });

      return res.status(201).json({
        message: "User registration successful",
        status: 200,
        error: null,
      });
    } else {
      // Handle other HTTP methods if needed
      return res.status(500).json({
        message: null,
        status: 500,
        error: "Unknown Method used",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: null,
      status: 500,
      error: "An Error occured on the Server. Please try again later !",
    });
  }
}
