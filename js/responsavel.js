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
let pedidoSelecionado = null;

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
    const tr = document.createElement("tr");

    const tdConsultor = document.createElement("td");
    tdConsultor.textContent = pedido.consultor || "";

    const tdQtd = document.createElement("td");
    tdQtd.textContent = pedido.tamanho || "";

    const tdStatus = document.createElement("td");
    tdStatus.textContent = pedido.status || "";

    // Aplica classe de cor conforme status
    if (pedido.status && pedido.status.toLowerCase() === "aceito") {
      tdStatus.classList.add("status-aceito");
    } else if (pedido.status && pedido.status.toLowerCase() === "pendente") {
      tdStatus.classList.add("status-pendente");
    }

    const tdAcoes = document.createElement("td");
    const btnVer = document.createElement("button");
    btnVer.textContent = "Ver";
    btnVer.type = "button";  // evita problemas com forms
    btnVer.addEventListener("click", () => abrirDetalhes(index));
    tdAcoes.appendChild(btnVer);

    tr.appendChild(tdConsultor);
    tr.appendChild(tdQtd);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);

    // Linha para detalhes, inicialmente escondida
    const trDetalhes = document.createElement("tr");
    trDetalhes.style.display = "none";
    trDetalhes.classList.add("detalhes-linha");
    trDetalhes.id = `detalhes-${index}`;
    const tdDetalhes = document.createElement("td");
    tdDetalhes.colSpan = 4;
    tdDetalhes.style.padding = "10px";
    tdDetalhes.style.backgroundColor = "#f9f9f9";
    tdDetalhes.style.borderTop = "none";
    tdDetalhes.innerHTML = `
      <strong>Consultor:</strong> ${pedido.consultor || ""}<br>
      <strong>Cliente:</strong> ${pedido.cliente || ""}<br>
      <strong>Cidade:</strong> ${pedido.cidade || ""}<br>
      <strong>Tipo:</strong> ${pedido.tipoPainel || ""}<br>
      <strong>Tamanho:</strong> ${pedido.tamanho || ""}<br>
      <strong>Gabinete:</strong> ${pedido.gabinete || ""}<br>
      <strong>Pixel:</strong> ${pedido.pixel || ""}<br>
      <strong>Descrição:</strong> ${pedido.descricao || ""}<br>
      <strong>Informações Úteis:</strong> ${pedido.info || ""}<br>
      <strong>Status:</strong> ${pedido.status || ""}
      <br><br>
      <button id="btn-aceitar-${index}">Aceitar</button>
      <button id="btn-finalizar-${index}">Finalizar</button>
    `;
    tbody.appendChild(trDetalhes);

    // Eventos dos botões aceitar e finalizar dentro dos detalhes
    setTimeout(() => { // Timeout para garantir que os elementos estejam no DOM
      document.getElementById(`btn-aceitar-${index}`).addEventListener("click", async () => {
        const pedidoRef = doc(db, "pedidos", pedido.id);
        await updateDoc(pedidoRef, { status: "aceito" });
        await carregarPedidos();
      });
      document.getElementById(`btn-finalizar-${index}`).addEventListener("click", async () => {
        const pedidoRef = doc(db, "pedidos", pedido.id);
        await deleteDoc(pedidoRef);
        await carregarPedidos();
      });
    }, 0);
  });
}

function abrirDetalhes(index) {
  // Esconde todas as linhas de detalhes abertas
  document.querySelectorAll(".detalhes-linha").forEach(tr => {
    tr.style.display = "none";
  });

  // Alterna a exibição da linha de detalhes correspondente
  const trDetalhes = document.getElementById(`detalhes-${index}`);
  if (trDetalhes.style.display === "table-row") {
    trDetalhes.style.display = "none";
  } else {
    trDetalhes.style.display = "table-row";
  }
}

document.addEventListener("DOMContentLoaded", carregarPedidos);
