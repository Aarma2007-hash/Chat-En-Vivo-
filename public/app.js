
// Conectar al servidor de Socket.IO
const socket = io();

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const imageInput = document.getElementById("imageInput");

// Conexión
socket.on("connect", () => {
  addMessage("✅ Conectado al chat en tiempo real!", "system");
  });

  // ✅ Recibir texto
  socket.on("chatMessage", ({ message, sender }) => {
    const type = sender === socket.id ? "sent" : "received";
      addMessage(message, type);
      });

      // ✅ Recibir imagen
      socket.on("chatImage", ({ imgData, sender }) => {
        const type = sender === socket.id ? "sent" : "received";
          addImage(imgData, type);
          });

          // Desconexiones
          socket.on("disconnect", () => {
            addMessage("❌ Conexión cerrada. Intentando reconectar...", "system");
            });

            socket.on("connect_error", () => {
              addMessage("⚠️ Error en la conexión con el servidor", "system");
              });

              // ✅ Enviar texto
              function sendMessage() {
                const message = messageInput.value.trim();
                  if (message === "") {
                      addMessage("⚠️ No puedes enviar un mensaje vacío.", "system");
                          return;
                            }

                              socket.emit("chatMessage", { message, sender: socket.id });
                                messageInput.value = "";
                                }

                                // ✅ Enviar imagen
                                function sendImage() {
                                  const file = imageInput.files[0];
                                    if (!file) return;

                                      const reader = new FileReader();
                                        reader.onload = function (e) {
                                            const imgBase64 = e.target.result;

                                                socket.emit("chatImage", { imgData: imgBase64, sender: socket.id });

                                                    // Limpiar input
                                                        imageInput.value = "";
                                                          };

                                                            reader.readAsDataURL(file);
                                                            }

                                                            // ✅ Añadir texto al chat
                                                            function addMessage(message, type) {
                                                              const messageElement = document.createElement("div");
                                                                messageElement.classList.add("message", type);
                                                                  messageElement.textContent = message;

                                                                    messagesDiv.appendChild(messageElement);
                                                                      messagesDiv.scrollTop = messagesDiv.scrollHeight;
                                                                      }

                                                                      // ✅ Añadir imagen al chat
                                                                      function addImage(imgData, type) {
                                                                        const div = document.createElement("div");
                                                                          div.classList.add("message", type);

                                                                            const img = document.createElement("img");
                                                                              img.src = imgData;
                                                                                img.classList.add("chat-image");

                                                                                  div.appendChild(img);
                                                                                    messagesDiv.appendChild(div);
                                                                                      messagesDiv.scrollTop = messagesDiv.scrollHeight;
                                                                                      }

                                                                                      function clearMessages() {
                                                                                        messagesDiv.innerHTML = "";
                                                                                          messageInput.value = "";
                                                                                          }

                                                                                          messageInput.addEventListener("keydown", (event) => {
                                                                                            if (event.key === "Enter") sendMessage();
                                                                                              if (event.key === "Escape") clearMessages();
                                                                                                if (event.key === "Tab") {
                                                                                                    messageInput.focus();
                                                                                                        event.preventDefault();
                                                                                                          }
                                                                                                          });