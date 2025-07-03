import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBs1jwFTLVKTZrmviCjuC70__A2Q-VGLog",
  authDomain: "projecao-c1ffc.firebaseapp.com",
  projectId: "projecao-c1ffc",
  storageBucket: "projecao-c1ffc.firebasestorage.app",
  messagingSenderId: "1048500488131",
  appId: "1:1048500488131:web:1b6a40e4268eac8f819f76"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let pedidosRecebidos = [];
let pedidoAbertoIndex = null;

async function carregarPedidos() {
  const snapshot = await getDocs(collection(db, "pedidos"));
  pedidosRecebidos = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  atualizarTabelaPedidos();
}

function atualizarTabelaPedidos() {
  const tbody = document.getElementById("tabela-geral-pedidos");
  tbody.innerHTML = "";

  pedidosRecebidos.forEach((pedido, index) => {
    // Linha principal do pedido
    const tr = document.createElement("tr");

    const tdConsultor = document.createElement("td");
    tdConsultor.textContent = pedido.consultor || "";

    const tdQtd = document.createElement("td");
    tdQtd.textContent = pedido.tamanho || "";

    const tdStatus = document.createElement("td");
    tdStatus.textContent = pedido.status || "";

    // Estiliza status
    if (pedido.status && pedido.status.toLowerCase() === "aceito") {
      tdStatus.classList.add("status-aceito");
    } else if (pedido.status && pedido.status.toLowerCase() === "pendente") {
      tdStatus.classList.add("status-pendente");
    }

    const tdAcoes = document.createElement("td");
    const btnVer = document.createElement("button");
    btnVer.textContent = "Ver";
    btnVer.type = "button";
    btnVer.addEventListener("click", () => toggleDetalhes(index));
    tdAcoes.appendChild(btnVer);

    tr.appendChild(tdConsultor);
    tr.appendChild(tdQtd);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);

    // Linha de detalhes
    const trDetalhes = document.createElement("tr");
    trDetalhes.style.display = "none";
    trDetalhes.classList.add("detalhes-linha");
    trDetalhes.id = `detalhes-${index}`;
    const tdDetalhes = document.createElement("td");
    tdDetalhes.colSpan = 4;
    tdDetalhes.style.padding = "10px";
    tdDetalhes.style.backgroundColor = "#f9f9f9";
    tdDetalhes.innerHTML = `
      <<strong>Consultor:</strong> ${pedido.consultor || ""}<br>
      <strong>Cliente:</strong> ${pedido.cliente || ""}<br>
      <strong>Cidade:</strong> ${pedido.cidade || ""}<br>
      <strong>Tipo:</strong> ${pedido.tipoPainel || ""}<br>
      <strong>Tamanho:</strong> ${pedido.tamanho || ""}<br>
      <strong>Gabinete:</strong> ${pedido.gabinete || ""}<br>
      <strong>Pixel:</strong> ${pedido.pixel || ""}<br>
      <strong>Descrição:</strong> ${pedido.descricao || ""}<br>
      <strong>Informações Úteis:</strong> ${pedido.info || ""}<br><br>
      <button id="btn-aceitar-${index}" type="button">Aceitar</button>
      <button id="btn-finalizar-${index}" type="button">Finalizar</button>
    `;
    trDetalhes.appendChild(tdDetalhes);
    tbody.appendChild(trDetalhes);

    // Adiciona listeners para os botões aceitar e finalizar
    setTimeout(() => {
      const btnAceitar = document.getElementById(`btn-aceitar-${index}`);
      const btnFinalizar = document.getElementById(`btn-finalizar-${index}`);

      if (btnAceitar) {
        btnAceitar.onclick = async () => {
          const pedidoRef = doc(db, "pedidos", pedido.id);
          await updateDoc(pedidoRef, { status: "aceito" });
          pedidoAbertoIndex = null;
          await carregarPedidos();
        };
      }

      if (btnFinalizar) {
        btnFinalizar.onclick = async () => {
          const pedidoRef = doc(db, "pedidos", pedido.id);
          await deleteDoc(pedidoRef);
          pedidoAbertoIndex = null;
          await carregarPedidos();
        };
      }
    }, 0);
  });
}

function toggleDetalhes(index) {
  // Fecha detalhes abertos diferentes do clicado
  if (pedidoAbertoIndex !== null && pedidoAbertoIndex !== index) {
    const trAnterior = document.getElementById(`detalhes-${pedidoAbertoIndex}`);
    if (trAnterior) trAnterior.style.display = "none";
  }

  const trDetalhes = document.getElementById(`detalhes-${index}`);
  if (!trDetalhes) return;

  if (trDetalhes.style.display === "table-row") {
    trDetalhes.style.display = "none";
    pedidoAbertoIndex = null;
  } else {
    trDetalhes.style.display = "table-row";
    pedidoAbertoIndex = index;
  }
}

document.addEventListener("DOMContentLoaded", carregarPedidos);
