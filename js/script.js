// script.js - versão robusta e compatível com múltiplas páginas

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- SLIDER ---------- */
  const slidesContainer = document.getElementById('slides');
  const slides = slidesContainer ? Array.from(slidesContainer.children) : [];
  const total = slides.length;
  const btnDuvidas = document.querySelector(".btn-duvidas")
  let index = 0;
  const intervalMs = 5000;
  let timer = null;
  const btnContador = document.querySelector(".btnContador");
  


  function goTo(i) {
    if (!slidesContainer || total === 0) return;
    index = ((i % total) + total) % total;
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
  }

  function resetTimer() {
    if (!slidesContainer || total === 0) return;
    if (timer) clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), intervalMs);
  }

  if (slidesContainer && total > 0) {
    // conectar botões se existirem
    const btnNext = document.querySelector('.slider-btn.next');
    const btnPrev = document.querySelector('.slider-btn.prev');

    if (btnNext) btnNext.addEventListener('click', () => { goTo(index + 1); resetTimer(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { goTo(index - 1); resetTimer(); });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (timer) clearInterval(timer);
      } else {
        resetTimer();
      }
    });

    slidesContainer.style.transition = slidesContainer.style.transition || 'transform 0.6s ease';
    goTo(0);
    resetTimer();
  }

  /* ---------- MODAL & QR ---------- */
  const modal = document.getElementById('modal');
  const textoModal = document.getElementById('modal-texto');
  const botaoWhats = document.getElementById('btn-whats');
  const qrImg = document.getElementById('qr-img');
  const areaQR = document.getElementById('area-qr');

  // função genérica para abrir modal com mensagem e link WhatsApp
  function abrirModalGenerico(mensagemTexto, mensagemWhats) {
    if (!modal || !textoModal || !botaoWhats) return;
    textoModal.innerHTML = mensagemTexto;
    const linkWhats = `https://wa.me/5515992442877?text=${encodeURIComponent(mensagemWhats)}`;
    botaoWhats.href = linkWhats;
    if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(linkWhats)}`;
    if (areaQR) areaQR.style.display = 'none';
    modal.style.display = 'flex';
  }

  // botão "outros certificados" (pode não existir em todas as páginas)
  const outrosCertificados = document.querySelector(".outros-certificados-btn");
  if (outrosCertificados) {
    outrosCertificados.addEventListener("click", () => {
      const mensagemTexto = `Não foi escolhido nenhum certificado.<br><br>Você será direcionado para o WhatsApp, assim te ajudaremos a encontrar o produto desejado.`;
      const mensagemWhats = `Olá! Não encontrei o certificado que preciso. Poderia me ajudar?`;
      abrirModalGenerico(mensagemTexto, mensagemWhats);
    });
  }

  // expor funções que são usadas por botões inline (abrirModalCertificado)
  window.abrirModalCertificado = function (nome, preco, validade) {
    if (nome === "duvidas" && preco === 'false' && validade === 'false') {
      const texto = "Você não escolheu nenhum certificado. Tire suas dúvidas pelo WhatsApp agora mesmo";
      const mensagemWhats = "Estou com dúvida sobre o certificado digital e preciso de esclarecimentos!"
      abrirModalGenerico(texto, mensagemWhats);
    } else if (validade === true) {
      const texto = "Você será direcionado para o WhatsApp, para assim encaminhar os seus clientes sem complicações. <br>Tire suas dúvidas antes de estabelecer uma parceria."
      const mensagemWhats = "Olá, sou contador e gostaria de saber mais informações à respeito dos certificados digitais."
      abrirModalGenerico(texto, mensagemWhats);
      validade = false;
    } else {
       if (!modal || !textoModal || !botaoWhats) return;
    const texto = `
      Você escolheu o certificado:<br><br>
      <strong>${nome}</strong><br>
      Valor: <strong>R$ ${preco}</strong> -
      Validade: ${validade}<br><br>
      Você será direcionado ao WhatsApp para iniciar o atendimento.
    `;
    const mensagemWhats = `Eu preciso de mais informações sobre o certificado *${nome}*, no valor de *R$ ${preco}*, com *validade de ${validade}*.`;
    abrirModalGenerico(texto, mensagemWhats);
  };
    }
   

  // fechar modal - adiciona listener ao botão de fechar (se existir)
  const btnFechar = document.querySelector('.modal-botoes button');
  if (btnFechar && modal) {
    btnFechar.addEventListener('click', () => modal.style.display = 'none');
  }

  // função para mostrar QR (botão inline chama window.mostrarQR)
  window.mostrarQR = function () {
    if (!areaQR) return;
    areaQR.style.display = (areaQR.style.display === 'none' || areaQR.style.display === '') ? 'block' : 'none';
  };

  // também cria função global fecharModal para compatibilidade
  window.fecharModal = function () {
    if (modal) modal.style.display = 'none';
  };

  /* ---------- HAMBURGER (nav) ---------- */
  const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
  const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links') || document.querySelector('.menu');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // fecha o menu se clicar fora (opcional)
  document.addEventListener('click', (e) => {
    if (!hamburger || !navLinks) return;
    const isClickInsideMenu = navLinks.contains(e.target) || hamburger.contains(e.target);
    if (!isClickInsideMenu) {
      navLinks.classList.remove('open');
    }
  });

}); // fim DOMContentLoaded

function toggleWhatsBox() {
  const box = document.getElementById("whatsBox");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

function fecharWhatsBox() {
  document.getElementById("whatsBox").style.display = "none";
  document.getElementById("whatsQR").style.display = "none";
  document.getElementById("whatsMessage").value = "";
}

function enviarWhats() {
  const msg = document.getElementById("whatsMessage").value.trim();
  const texto = encodeURIComponent(msg || "Olá, gostaria de atendimento.");
  window.open(`https://wa.me/5515992442877?text=${texto}`, "_blank");
}

function gerarQRWhats() {
  const msg = document.getElementById("whatsMessage").value.trim();
  const texto = encodeURIComponent(msg || "Olá, gostaria de atendimento.");

  const qr = document.getElementById("qrWhatsImg");
  const area = document.getElementById("whatsQR");

  qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `https://wa.me/5515992442877?text=${texto}`
  )}`;

  area.style.display = "block";
}
