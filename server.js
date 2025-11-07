const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const serverless = require("serverless-http");
require('dotenv').config();

// Crear el servidor de Express
const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*",
          methods: ["GET", "POST"],
            },
            });

            const PORT = process.env.PORT || 3000;

            // Servir archivos estáticos
            app.use(express.static("public"));

            io.on("connection", (socket) => {
              console.log("Nuevo cliente conectado:", socket.id);

                socket.on("chatMessage", ({ message, sender }) => {
                    io.emit("chatMessage", { message, sender });
                      });

                        // ✅ Nuevo evento para imágenes
                          socket.on("chatImage", ({ imgData, sender }) => {
                              io.emit("chatImage", { imgData, sender });
                                });

                                  socket.on("disconnect", () => {
                                      console.log("Cliente desconectado:", socket.id);
                                        });
                                        });

                                        module.exports.handler = serverless(app);

                                        if (require.main === module) {
                                          server.listen(PORT, () => {
                                              console.log(`Servidor escuchando en http://localhost:${PORT}`);
                                                });
                                                }
