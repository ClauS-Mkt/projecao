import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Configuração Firebase
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checklist-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const consultor = document.getElementById("consultor").value.trim();
    const cliente = document.getElementById("cliente").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const tipoPainel = document.getElementById("tipo-painel").value;
    const gabinete = document.getElementById("gabinete").value.trim();
    const pixel = document.getElementById("pixel").value.trim();
    const tamanho = document.getElementById("tamanho").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const info = document.getElementById("info").value.trim();

    if (!consultor || !cliente || !cidade || !tipoPainel || !gabinete || !pixel || !tamanho || !descricao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const novoPedido = {
      consultor,
      cliente,
      cidade,
      tipoPainel,
      gabinete,
      pixel,
      tamanho,
      descricao,
      info,
      status: "pendente",
      criadoEm: Timestamp.now()  // salva a data/hora do pedido
    };

    try {
      await addDoc(collection(db, "pedidos"), novoPedido);
      alert("Pedido enviado com sucesso!");
      e.target.reset();
      carregarPedidos(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      alert("Erro ao enviar pedido.");
    }
  });

  // Função para carregar e mostrar os pedidos, ordenados por criadoEm (mais antigo primeiro)
  async function carregarPedidos() {
    const tbody = document.getElementById("tabela-pedidos");
    tbody.innerHTML = "";

    const pedidosRef = collection(db, "pedidos");
    const q = query(pedidosRef, orderBy("criadoEm", "asc")); // ordena do mais antigo para o mais recente

    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
      const pedido = doc.data();

      const tr = document.createElement("tr");

      const tdProduto = document.createElement("td");
      tdProduto.textContent = pedido.tipoPainel + " - " + pedido.pixel;

      const tdTamanho = document.createElement("td");
      tdTamanho.textContent = pedido.tamanho;

      const tdStatus = document.createElement("td");
      tdStatus.textContent = pedido.status;

      // Aplica a classe conforme status
      if (pedido.status.toLowerCase() === "ACEITO") {
        tdStatus.classList.add("status-aceito");
      } else if (pedido.status.toLowerCase() === "PENDENTE") {
        tdStatus.classList.add("status-pendente");
      }

      tr.appendChild(tdProduto);
      tr.appendChild(tdTamanho);
      tr.appendChild(tdStatus);

      tbody.appendChild(tr);
    });
  }

  // Carrega os pedidos quando a página terminar de carregar
  carregarPedidos();
});
