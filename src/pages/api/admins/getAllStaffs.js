import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    // Check if the request method is GET
    if (req.method === "GET") {
      // Extract token from headers and validate
      const decodedToken = getTokenFromHeaders(req.headers);
      if (!decodedToken) {
        return res.status(403).json({ error: "Forbidden: Token has expired" });
      }

      // Check if the role is ADMIN
      const { role } = decodedToken;
      if (role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Forbidden: Staff is not authorized" });
      }

      // Fetch all admin details from the database
      const staffs = await prisma.staff.findMany();
      // console.log({staffs})

      // Return the list of admins
      return res.status(200).json({ message: staffs, error: null });
    } else {
      // Handle other HTTP methods if needed
      return res.status(405).json({
        message: "Method Not Allowed",
        status: 405,
        error: "Only GET method is allowed for this endpoint",
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({
      message: null,
      status: 500,
      error: "An error occurred on the server. Please try again later!",
    });
  }
}
