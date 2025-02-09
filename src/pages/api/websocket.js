const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

// Initialize the Prisma client
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

const httpsServer = createServer();
const io = new Server(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("authenticate", async (data) => {
    try {
      const decodedToken = jwt.verify(data.token, process.env.JWT_SECRET);
      if (!decodedToken || decodedToken.role !== "STAFF") {
        socket.emit("error", "Forbidden: User is not authorized");
        return;
      }

      socket.emit("text", "Sample Text");

      console.log("Authenticated:", decodedToken);

      // Fetch all orders for the user
      const userOrders = await prisma.ambulanceOrder.findMany();

      console.log({ userOrders });

      //   socket.emit("orders", userOrders);
    } catch (error) {
      console.error("Authentication error:", error.message);
      socket.emit("error", "Authentication failed");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpsServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
