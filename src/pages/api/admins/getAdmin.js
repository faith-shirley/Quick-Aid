import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
       
      const decodedToken = getTokenFromHeaders(req.headers);
      if (!decodedToken) {
        return res.status(403).json({ error: "Forbidden: Token has expired" });
      }

      // Check if the role is ADMIN
      const { role } = decodedToken;
      if (role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Forbidden: User is not authorized" });
      }

      const id = decodedToken?.id;

      // Validate if id is provided
      if (!id) {
        return res.status(400).json({ error: "Admin id is required" });
      }

      // Fetch admin details from the database
      const admin = await prisma.admin.findUnique({
        where: { id },
      });

      // Check if admin exists
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // Return admin details
      return res.status(200).json({ message: admin, error: null });
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
