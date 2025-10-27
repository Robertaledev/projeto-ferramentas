// Carrega o inventário e histórico do localStorage
let inventario = JSON.parse(localStorage.getItem('inventario')) || {};
let historico = JSON.parse(localStorage.getItem('historico')) || [];

function salvarDados() {
    localStorage.setItem('inventario', JSON.stringify(inventario));
    localStorage.setItem('historico', JSON.stringify(historico));
}

function adicionarFerramenta() {
    const nome = document.getElementById('nome').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const localizacao = document.getElementById('localizacao').value.trim();
    
    if (!nome || isNaN(quantidade) || quantidade <= 0 || !localizacao) {
        alert('Preencha todos os campos corretamente.');
        return;
    }
    
    if (inventario[nome]) {
        inventario[nome].quantidade += quantidade;
    } else {
        inventario[nome] = { quantidade, localizacao };
    }
    
    salvarDados();
    alert(`Ferramenta '${nome}' adicionada/atualizada.`);
    limparCampos();
    visualizarInventario();
}

function emprestarFerramenta() {
    const nome = document.getElementById('nomeAcao').value.trim();
    const quantidade = parseInt(document.getElementById('quantidadeAcao').value);
    const solicitante = document.getElementById('solicitante').value.trim();
    
    if (!nome || isNaN(quantidade) || quantidade <= 0 || !solicitante) {
        alert('Preencha todos os campos, incluindo o nome do solicitante.');
        return;
    }
    
    if (inventario[nome] && inventario[nome].quantidade >= quantidade) {
        inventario[nome].quantidade -= quantidade;
        historico.push({
            acao: 'Empréstimo',
            nome,
            quantidade,
            solicitante,
            data: new Date().toLocaleString()
        });
        salvarDados();
        alert(`${quantidade} unidade(s) de '${nome}' emprestada(s) para ${solicitante}.`);
        limparCamposAcao();
        visualizarInventario();
    } else {
        alert('Ferramenta insuficiente ou não encontrada.');
    }
}

function devolverFerramenta() {
    const nome = document.getElementById('nomeAcao').value.trim();
    const quantidade = parseInt(document.getElementById('quantidadeAcao').value);
    
    if (!nome || isNaN(quantidade) || quantidade <= 0) {
        alert('Preencha os campos corretamente.');
        return;
    }
    
    if (inventario[nome]) {
        inventario[nome].quantidade += quantidade;
        historico.push({
            acao: 'Devolução',
            nome,
            quantidade,
            data: new Date().toLocaleString()
        });
        salvarDados();
        alert(`${quantidade} unidade(s) de '${nome}' devolvida(s).`);
        limparCamposAcao();
        visualizarInventario();
    } else {
        alert('Ferramenta não encontrada.');
    }
}

function visualizarInventario() {
    const tbody = document.getElementById('inventarioBody');
    tbody.innerHTML = '';
    
    if (Object.keys(inventario).length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Inventário vazio.</td></tr>';
        return;
    }
    
    for (const [nome, dados] of Object.entries(inventario)) {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = nome;
        row.insertCell(1).textContent = dados.quantidade;
        row.insertCell(2).textContent = dados.localizacao;
    }
}

function visualizarHistorico() {
    const ul = document.getElementById('historicoList');
    ul.innerHTML = '';
    
    if (historico.length === 0) {
        ul.innerHTML = '<li>Nenhum histórico disponível.</li>';
        return;
    }
    
    historico.slice(-10).reverse().forEach(item => {  // Mostra os últimos 10
        const li = document.createElement('li');
        li.textContent = `${item.data} - ${item.acao}: ${item.quantidade} unidade(s) de '${item.nome}'${item.solicitante ? ` (Solicitante: ${item.solicitante})` : ''}`;
        ul.appendChild(li);
    });
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('localizacao').value = '';
}

function limparCamposAcao() {
    document.getElementById('nomeAcao').value = '';
    document.getElementById('quantidadeAcao').value = '';
    document.getElementById('solicitante').value = '';
}

// Carrega o inventário ao iniciar
visualizarInventario();