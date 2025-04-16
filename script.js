function atualizarQuantidadeCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    document.getElementById('quantidade-carrinho').textContent = totalItens;
  }

  atualizarQuantidadeCarrinho();
  window.atualizarQuantidadeCarrinho = atualizarQuantidadeCarrinho;