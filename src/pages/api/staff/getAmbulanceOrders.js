import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Extract token from headers
      const decodedToken = getTokenFromHeaders(req.headers);
      if (!decodedToken) {
        return res.status(403).json({ error: "Forbidden: Token has expired" });
      }

      // Check if the role is STAFF
      const { role } = decodedToken;
      if (role !== "STAFF") {
        return res
          .status(403)
          .json({ error: "Forbidden: User is not authorized" });
      }

      // Fetch all ambulance orders with status PENDING
      const orders = await prisma.ambulanceOrder.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" }, // Order by createdAt descending
        include: { user: true }, // Include user data
      });

      // Return the list of ambulanceOrder
      return res.status(200).json({ message: orders.reverse(), error: null });
    } else {
      return res.status(405).json({
        message: "Method Not Allowed",
        error: "Only GET method is allowed for this endpoint",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
