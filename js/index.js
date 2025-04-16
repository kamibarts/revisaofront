const container = document.getElementById("produtos");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalNome = document.getElementById("modal-nome");
const modalDesc = document.getElementById("modal-desc");
const modalPreco = document.getElementById("modal-preco");
const modalFrete = document.getElementById("modal-frete");
const btnAddCarrinho = document.getElementById("btn-add-carrinho");
const btnClose = document.querySelector(".close");

let produtoSelecionado = null;

function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function renderProdutos() {
  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <p><strong>${formatarPreco(produto.preco)}</strong></p>
      <button onclick="abrirModal(${produto.id})">Detalhes</button>
    `;
    container.appendChild(card);
  });
}

function abrirModal(id) {
  const produto = produtos.find(p => p.id === id);
  produtoSelecionado = produto;

  modalImg.src = produto.imagem;
  modalNome.textContent = produto.nome;
  modalDesc.textContent = produto.descricao;
  modalPreco.textContent = `Preço: ${formatarPreco(produto.preco)}`;

  const frete = produto.peso * 0.1;
  modalFrete.textContent = `Frete: ${formatarPreco(frete)}`;

  modal.classList.remove("hidden");
}

btnClose.onclick = () => {
  modal.classList.add("hidden");
};

btnAddCarrinho.onclick = () => {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const existente = carrinho.find(p => p.id === produtoSelecionado.id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...produtoSelecionado, quantidade: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  if (typeof atualizarQuantidadeCarrinho === 'function') {
    atualizarQuantidadeCarrinho();
  }

  modal.classList.add("hidden");
  alert("Produto adicionado ao carrinho!");
};

renderProdutos();
const carrinhoContainer = document.getElementById('carrinho-container');
    const totalSpan = document.getElementById('total');
    const btnEnviar = document.getElementById('enviar-pedido');
    const dadosPagamento = document.getElementById('dados-pagamento');
    const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');

    function carregarCarrinho() {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      carrinhoContainer.innerHTML = '';
      let total = 0;

      carrinho.forEach((produto, index) => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        const item = document.createElement('div');
        item.classList.add('item-carrinho');
        item.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" />
          <div class="info">
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
            <label>Qtd:
              <input type="number" min="0" value="${produto.quantidade}" data-index="${index}" />
            </label>
          </div>
        `;
        carrinhoContainer.appendChild(item);
      });

      totalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    carrinhoContainer.addEventListener('input', (e) => {
      if (e.target.type === 'number') {
        const index = e.target.getAttribute('data-index');
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const novaQtd = parseInt(e.target.value);

        if (novaQtd === 0) {
          carrinho.splice(index, 1);
        } else {
          carrinho[index].quantidade = novaQtd;
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
      }
    });

    function atualizarFormularioPagamento() {
      const forma = document.querySelector('input[name="pagamento"]:checked').value;
      dadosPagamento.innerHTML = '';

      if (forma === 'Pix') {
        dadosPagamento.innerHTML = `
          <input type="text" id="nomePix" placeholder="Nome completo" required>
          <input type="text" id="chavePix" placeholder="Chave Pix (CPF, e-mail ou telefone)" required>
        `;
      } else if (forma === 'Cartão') {
        dadosPagamento.innerHTML = `
          <input type="text" id="nomeCartao" placeholder="Nome completo" required>
          <input type="email" id="emailCartao" placeholder="E-mail" required>
          <input type="text" id="cpfCartao" placeholder="CPF" required>
          <input type="text" id="numeroCartao" placeholder="Número do Cartão" required>
          <input type="text" id="validadeCartao" placeholder="Validade (MM/AA)" required>
          <input type="text" id="cvvCartao" placeholder="CVV" required>
        `;
      }
    }

    radiosPagamento.forEach(radio => {
      radio.addEventListener('change', atualizarFormularioPagamento);
    });

    btnEnviar.addEventListener('click', () => {
      const formaSelecionada = document.querySelector('input[name="pagamento"]:checked').value;

      if (formaSelecionada === 'Pix') {
        const nome = document.getElementById('nomePix')?.value;
        const chave = document.getElementById('chavePix')?.value;
        if (!nome || !chave) {
          alert('Preencha os dados do Pix corretamente!');
          return;
        }
        alert(`Pedido enviado via Pix!\nNome: ${nome}\nChave Pix: ${chave}`);
      }

      else if (formaSelecionada === 'Cartão') {
        const nome = document.getElementById('nomeCartao')?.value;
        const email = document.getElementById('emailCartao')?.value;
        const cpf = document.getElementById('cpfCartao')?.value;
        const numero = document.getElementById('numeroCartao')?.value;
        const validade = document.getElementById('validadeCartao')?.value;
        const cvv = document.getElementById('cvvCartao')?.value;

        if (!nome || !email || !cpf || !numero || !validade || !cvv) {
          alert('Preencha todos os dados do cartão!');
          return;
        }

        alert(`Pedido enviado com Cartão!\nNome: ${nome}\nEmail: ${email}`);
      }

      else if (formaSelecionada === 'Boleto') {
        alert('Pedido gerado via boleto! Enviaremos o código para seu e-mail.');
      }

      localStorage.removeItem('carrinho');
      window.location.href = 'index.html';
    });

    carregarCarrinho();
    atualizarFormularioPagamento();