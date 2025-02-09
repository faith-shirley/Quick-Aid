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

      // Check if the role is USER
      const { role, id } = decodedToken;
      if (role !== "USER") {
        return res
          .status(403)
          .json({ error: "Forbidden: User is not authorized" });
      }

      // Extract order ID from the request body
      const { orderId } = req.body;
      if (!orderId) {
        return res
          .status(400)
          .json({ error: "Bad Request: Order ID is required" });
      }
      
      // Find the order to ensure it belongs to the user and has a status that allows deletion
      const order = await prisma.ambulanceOrder.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).json({ error: "Not Found: Order not found" });
      }

      if (order.userId !== id) {
        return res.status(403).json({
          error: "Forbidden: You are not authorized to delete this order",
        });
      }

      // Proceed to delete the order
      await prisma.ambulanceOrder.delete({
        where: { id: orderId },
      });

      return res
        .status(200)
        .json({ message: "Order deleted successfully", error: null });
    } else {
      return res.status(405).json({
        message: "Method Not Allowed",
        error: "Only GET and DELETE methods are allowed for this endpoint",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
