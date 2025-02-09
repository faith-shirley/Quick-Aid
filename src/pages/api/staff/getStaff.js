import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const decodedToken = getTokenFromHeaders(req.headers);
      if (!decodedToken) {
        return res.status(403).json({ error: "Forbidden: Token has expired" });
      }

      // Check if the role is STAFF
      const { role } = decodedToken;
      if (role !== "STAFF") {
        return res
          .status(403)
          .json({ error: "Forbidden: Staff is not authorized" });
      }

      const id = decodedToken?.id;

      // Validate if id is provided
      if (!id) {
        return res.status(400).json({ error: "Staff id is required" });
      }

      // Fetch staff details from the database
      const staff = await prisma.staff.findUnique({
        where: { id },
      });

      // Check if staff exists
      if (!staff) {
        return res.status(404).json({ error: "Staff not found" });
      }

      // Return staff details
      return res.status(200).json({ message: staff, error: null });
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
