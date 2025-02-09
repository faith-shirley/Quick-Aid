import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "DELETE") {
      // Extract token from headers
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

      // Extract staff ID from the request query
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Bad Request: Staff ID is required" });
      }

      // Delete the staff from the database
      const deletedStaff = await prisma.staff.delete({
        where: { id },
      });

      // Return success message
      return res.status(200).json({
        message: "Staff deleted successfully",
        data: deletedStaff,
        error: null,
      });
    } else {
      return res.status(405).json({
        message: "Method Not Allowed",
        error: "Only DELETE method is allowed for this endpoint",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
