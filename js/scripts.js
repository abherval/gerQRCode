const container = document.querySelector(".container");
const qrCodeBtn = document.querySelector("#qr-form button");
const qrCodeInput = document.querySelector("#qr-form input");
const qrCodeImg = document.querySelector("#qr-code img");
const qrResponse = document.querySelector(".qr-response");
const btnCopy = document.querySelector("#btnCopy");

// Inicialmente, esconder o botão de copiar
if (btnCopy) {
  btnCopy.classList.add("btnCopyHidden");
}

/* Eventos */
function generateQrCode() {
  const qrCodeInputValue = qrCodeInput.value.trim();

  if (!qrCodeInputValue) {
    if (qrResponse) {
      qrResponse.classList.remove("activeDisplay");
    }
    return;
  }

  if (qrCodeBtn) {
    qrCodeBtn.innerText = "Gerando código...";
  }

  if (qrCodeImg) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeInputValue}`;
    qrCodeImg.src = qrCodeUrl;

    qrCodeImg.addEventListener("load", () => {
      if (container) {
        container.classList.add("active");
      }
      if (qrResponse) {
        qrResponse.classList.add("activeDisplay");
      }

      if (qrCodeBtn) {
        qrCodeBtn.innerText = "Código criado!";
      }

      // Mostrar o botão de copiar quando a imagem for carregada
      if (btnCopy) {
        btnCopy.classList.remove("btnCopyHidden");
        btnCopy.style.display = "block"; // Adiciona esta linha
      }
    });
  }
}

function copyQrCodeToClipboard() {
  const qrCodeUrl = qrCodeImg.src;

  fetch(qrCodeUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard
        .write([item])
        .then(() => {
          console.log("Imagem copiada para a área de transferência!");
        })
        .catch((err) => {
          console.error("Erro ao copiar a imagem: ", err);
        });
    });
}

if (qrCodeBtn) {
  qrCodeBtn.addEventListener("click", generateQrCode);
}

if (btnCopy) {
  btnCopy.addEventListener("click", copyQrCodeToClipboard);
}

if (qrCodeInput) {
  qrCodeInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      generateQrCode();
    }
  });

  // Limpar área do QR Code
  qrCodeInput.addEventListener("keyup", () => {
    if (!qrCodeInput.value) {
      if (container) {
        container.classList.remove("active");
      }

      if (qrCodeBtn) {
        qrCodeBtn.innerText = "Gerar QR Code";
      }

      // Esconder o botão de copiar se o campo de entrada estiver vazio
      if (btnCopy) {
        btnCopy.classList.remove("btnCopyHidden");
        btnCopy.style.display = "none"; // Adiciona esta linha
      }
    }
  });
}
