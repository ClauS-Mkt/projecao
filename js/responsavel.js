// Simulando pedidos em memória (em breve virá do Firebase)
let pedidosRecebidos = [
  {
    produto: "Painel LED P5",
    quantidade: 2,
    descricao: "Instalação para evento no centro",
    status: "pendente"
  },
  {
    produto: "Totem Interativo",
    quantidade: 1,
    descricao: "Loja shopping - ativação promocional",
    status: "pendente"
  }
];

let pedidoSelecionado = null;

function atualizarTabelaPedidos() {
  const tbody = document.getElementById("tabela-geral-pedidos");
  tbody.innerHTML = "";

  pedidosRecebidos.forEach((pedido, index) => {
    const tr = document.createElement("tr");

    const tdProduto = document.createElement("td");
    tdProduto.textContent = pedido.produto;

    const tdQtd = document.createElement("td");
    tdQtd.textContent = pedido.quantidade;

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

  document.getElementById("det-produto").textContent = pedido.produto;
  document.getElementById("det-quantidade").textContent = pedido.quantidade;
  document.getElementById("det-descricao").textContent = pedido.descricao;

  document.getElementById("detalhes-pedido").style.display = "block";
}

document.getElementById("btn-aceitar").addEventListener("click", () => {
  if (pedidoSelecionado !== null) {
    pedidosRecebidos[pedidoSelecionado].status = "aceito";
    atualizarTabelaPedidos();
    document.getElementById("detalhes-pedido").style.display = "none";
  }
});

document.getElementById("btn-finalizar").addEventListener("click", () => {
  if (pedidoSelecionado !== null) {
    pedidosRecebidos.splice(pedidoSelecionado, 1); // Remove da lista
    atualizarTabelaPedidos();
    document.getElementById("detalhes-pedido").style.display = "none";
    pedidoSelecionado = null;
  }
});

// Inicializa tabela ao carregar
document.addEventListener("DOMContentLoaded", atualizarTabelaPedidos);
