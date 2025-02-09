import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
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

      // Extract ambulance order ID from request body
      const { id, staffId } = req.body;
      if (!id) {
        return res
          .status(400)
          .json({ error: "Bad Request: Missing ambulanceOrderId" });
      }

      // Update the ambulance order status to COMPLETED
      const updatedOrder = await prisma.ambulanceOrder.update({
        where: { id },
        data: {
          status: "COMPLETED",
          staffId: staffId,
        },
      });

      // Return the updated ambulance order
      return res.status(200).json({
        message: "Ambulance order status updated to COMPLETED",
        data: updatedOrder,
      });
    } else {
      return res.status(405).json({
        message: "Method Not Allowed",
        error: "Only POST method is allowed for this endpoint",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
