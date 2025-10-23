// Conectar al servidor de Socket.IO
document.addEventListener("DOMContentLoaded", () => {
  // app.js
  let username = prompt("Ingresa tu nombre de usuario:");
  if (!username) username = "Anónimo"; // fallback

  const sendBtn = document.getElementById("sendBtn");
  const clearBtn = document.getElementById("clearBtn");

  sendBtn.addEventListener("click", () => {
    sendMessage();
  });

  clearBtn.addEventListener("click", () => {
    clearMessages();
  });

  const socket = io();

  // Elementos del DOM
  const messagesDiv = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const imagenInput = document.getElementById("imageInput");

  // Conectar con el servidor de Socket.IO
  socket.on("connect", () => {
    console.log("Conectado al servidor Socket.IO");
    addMessage("✅ Conectado al chat en tiempo real!", "system");
  });

  // Manejar mensajes recibidos del servidor (de otros usuarios y del propio usuario)
  socket.on("chatMessage", ({ message, sender }) => {
    const type = sender === username ? "sent" : "received";
    addMessage(message, type, sender);
  });

  socket.on("imageMessage", ({ imagen, sender }) => {
    const type = sender === username ? "sent" : "received";
    addImagen(imagen, type, sender);
  });
  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
    addMessage("❌ Conexión cerrada. Intentando reconectar...", "system");
  });

  // Manejar errores
  socket.on("connect_error", (error) => {
    console.error("Error de conexión:", error);
    addMessage("⚠️ Error en la conexión con el servidor", "system");
  });

  // Función para enviar mensajes
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message === "") {
      addMessage("⚠️ No puedes enviar un mensaje vacío.", "system");
      return;
    }

    // Enviar el mensaje al servidor junto con el ID del usuario
    socket.emit("chatMessage", { message, sender: username });
    messageInput.value = ""; // Vaciar el campo de texto
  }

  // Función para añadir mensajes al chat
  function addMessage(message, type, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    if (type === "sent") messageElement.classList.add("sent");
    else if (type === "received") messageElement.classList.add("received");
    else messageElement.classList.add("system");

    // Nombre en negrita + mensaje
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function addImagen(imagen, type, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    if (type === "sent") messageElement.classList.add("sent");
    else if (type === "received") messageElement.classList.add("received");
    else messageElement.classList.add("system");

    const img = document.createElement("img");
    img.src = imagen;
    img.style.maxWidth = "200px";
    img.style.display = "block";

    // Nombre + imagen
    messageElement.innerHTML = `<strong>${sender}:</strong><br>`;
    messageElement.appendChild(img);

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function clearMessages() {
    messagesDiv.innerHTML = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    messageInput.value = "";
  }

  // Evento para enviar el mensaje al presionar Enter
  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      clearMessages();
    }
  });

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      messageInput.focus();
      event.preventDefault();
    }
  });

  imagenInput.addEventListener("change", () => {
    const file = imagenInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result; // base64
      socket.emit("imageMessage", { imagen: imageData, sender: username });
    };
    reader.readAsDataURL(file);

    // Limpiar input si querés que pueda seleccionar otra imagen
    imagenInput.value = "";
  });
});
