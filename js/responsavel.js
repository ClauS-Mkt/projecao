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

    const tdProduto = document.createElement("td");
    tdProduto.textContent = pedido.tipoPainel + " - " + pedido.pixel;

    const tdQtd = document.createElement("td");
    tdQtd.textContent = pedido.tamanho;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = pedido.status;

    const tdAcoes = document.createElement("td");
    const btnVer = document.createElement("button");
    btnVer.textContent = "Ver";
    btnVer.addEventListener("click", () => abrirDetalhes(index));
    tdAcoes.appendChild(btnVer);

    tr.appendChild(tdProduto);
    tr.appendChild(tdQtd);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);
  });
}

function abrirDetalhes(index) {
  pedidoSelecionado = index;
  const pedido = pedidosRecebidos[index];

  document.getElementById("det-produto").textContent = pedido.tipoPainel + " - " + pedido.pixel;
  document.getElementById("det-quantidade").textContent = pedido.tamanho;
  document.getElementById("det-descricao").textContent = pedido.descricao + "\n\n" + pedido.info;

  document.getElementById("detalhes-pedido").style.display = "block";
}

document.getElementById("btn-aceitar").addEventListener("click", async () => {
  if (pedidoSelecionado !== null) {
    const pedido = pedidosRecebidos[pedidoSelecionado];
    const pedidoRef = doc(db, "pedidos", pedido.id);
    await updateDoc(pedidoRef, { status: "aceito" });
    await carregarPedidos();
    document.getElementById("detalhes-pedido").style.display = "none";
  }
});

document.getElementById("btn-finalizar").addEventListener("click", async () => {
  if (pedidoSelecionado !== null) {
    const pedido = pedidosRecebidos[pedidoSelecionado];
    const pedidoRef = doc(db, "pedidos", pedido.id);
    await deleteDoc(pedidoRef);
    await carregarPedidos();
    document.getElementById("detalhes-pedido").style.display = "none";
    pedidoSelecionado = null;
  }
});

document.addEventListener("DOMContentLoaded", carregarPedidos);
