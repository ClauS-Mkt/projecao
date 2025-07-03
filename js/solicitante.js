// Simula um armazenamento local dos pedidos
const pedidos = [];

document.getElementById("checklist-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const produto = document.getElementById("produto").value.trim();
  const quantidade = document.getElementById("quantidade").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (!produto || !quantidade || !descricao) return;

  const novoPedido = {
    produto,
    quantidade,
    descricao,
    status: "pendente"
  };

  pedidos.push(novoPedido);
  atualizarTabelaPedidos();
  this.reset(); // limpa o formulário
});

function atualizarTabelaPedidos() {
  const tbody = document.getElementById("tabela-pedidos");
  tbody.innerHTML = "";

  pedidos.forEach((pedido, index) => {
    const tr = document.createElement("tr");

    const tdProduto = document.createElement("td");
    tdProduto.textContent = pedido.produto;

    const tdQtd = document.createElement("td");
    tdQtd.textContent = pedido.quantidade;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = pedido.status;

    tr.appendChild(tdProduto);
    tr.appendChild(tdQtd);
    tr.appendChild(tdStatus);

    tbody.appendChild(tr);
  });
}
