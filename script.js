document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos do DOM
    const tarefaInput = document.getElementById('tarefa');
    const adicionarBtn = document.getElementById('adicionar');
    const listaTarefas = document.getElementById('lista-tarefas');
    const sumarioEl = document.getElementById('sumario');
    const todasBtn = document.getElementById('todas');
    const ativasBtn = document.getElementById('ativas');
    const completasBtn = document.getElementById('completas');
    const pessoalBtn = document.getElementById('pessoal');
    const trabalhoBtn = document.getElementById('trabalho');
    const estudosBtn = document.getElementById('estudos');
    const ordenarDataBtn = document.getElementById('ordenar-data');
    const ordenarTextoBtn = document.getElementById('ordenar-texto');
    const ordenarStatusBtn = document.getElementById('ordenar-status');
    
    // Array para armazenar as tarefas
    let tarefas = [];
    let filtroAtual = 'todas';
    
    // Funções de gerenciamento de tarefas
    function carregarTarefas() {
        const tarefasSalvas = localStorage.getItem('tarefas');
        if (tarefasSalvas) {
            tarefas = JSON.parse(tarefasSalvas);
            atualizarLista();
        }
    }
    
    function salvarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
    
    function adicionarTarefa() {
        const texto = tarefaInput.value.trim();
        
        if (texto === '') {
            alert('Por favor, digite uma tarefa!');
            return;
        }
        
        const tarefa = {
            id: Date.now(),
            texto: texto,
            completa: false,
            dataCriacao: new Date(),
            dataVencimento: document.getElementById('data-vencimento').value,
            categoria: document.getElementById('categoria').value,
            subtarefas: []
        };
        
        tarefas.push(tarefa);
        tarefaInput.value = '';
        document.getElementById('data-vencimento').value = '';
        document.getElementById('categoria').value = 'pessoal';
        
        atualizarLista();
        salvarTarefas();
    }
    
    function completarTarefa(id) {
        const tarefa = tarefas.find(item => item.id === id);
        
        if (tarefa) {
            tarefa.completa = !tarefa.completa;
            atualizarLista();
            salvarTarefas();
        }
    }
    
    function removerTarefa(id) {
        tarefas = tarefas.filter(item => item.id !== id);
        atualizarLista();
        salvarTarefas();
    }

    // Funções de subtarefas
    function adicionarSubtarefa(tarefaId) {
        const subtarefaInput = document.createElement('div');
        subtarefaInput.className = 'subtarefa-input';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Nova subtarefa...';
        
        const botao = document.createElement('button');
        botao.textContent = 'Adicionar';
        botao.onclick = () => {
            const texto = input.value.trim();
            if (texto) {
                const tarefa = tarefas.find(t => t.id === tarefaId);
                if (!tarefa.subtarefas) {
                    tarefa.subtarefas = [];
                }
                
                tarefa.subtarefas.push({
                    id: Date.now(),
                    texto: texto,
                    completa: false
                });
                
                atualizarLista();
                salvarTarefas();
            }
        };
        
        subtarefaInput.appendChild(input);
        subtarefaInput.appendChild(botao);
        return subtarefaInput;
    }
    
    function completarSubtarefa(tarefaId, subtarefaId) {
        const tarefa = tarefas.find(t => t.id === tarefaId);
        if (tarefa && tarefa.subtarefas) {
            const subtarefa = tarefa.subtarefas.find(st => st.id === subtarefaId);
            if (subtarefa) {
                subtarefa.completa = !subtarefa.completa;
                
                // Verificar se todas as subtarefas estão completas
                tarefa.completa = tarefa.subtarefas.every(st => st.completa);
                
                atualizarLista();
                salvarTarefas();
            }
        }
    }
    
    function removerSubtarefa(tarefaId, subtarefaId) {
        const tarefa = tarefas.find(t => t.id === tarefaId);
        if (tarefa && tarefa.subtarefas) {
            tarefa.subtarefas = tarefa.subtarefas.filter(st => st.id !== subtarefaId);
            atualizarLista();
            salvarTarefas();
        }
    }
    
    // Funções de ordenação e filtragem
    function mudarFiltro(filtro) {
        filtroAtual = filtro;
        
        // Atualizar classes dos botões
        todasBtn.classList.remove('ativo');
        ativasBtn.classList.remove('ativo');
        completasBtn.classList.remove('ativo');
        pessoalBtn.classList.remove('ativo');
        trabalhoBtn.classList.remove('ativo');
        estudosBtn.classList.remove('ativo');
        
        if (filtro === 'todas') {
            todasBtn.classList.add('ativo');
        } else if (filtro === 'ativas') {
            ativasBtn.classList.add('ativo');
        } else if (filtro === 'completas') {
            completasBtn.classList.add('ativo');
        } else if (filtro === 'pessoal') {
            pessoalBtn.classList.add('ativo');
        } else if (filtro === 'trabalho') {
            trabalhoBtn.classList.add('ativo');
        } else if (filtro === 'estudos') {
            estudosBtn.classList.add('ativo');
        }
        
        atualizarLista();
    }
    
    // Função principal de atualização da lista
    function atualizarLista() {
        listaTarefas.innerHTML = '';
        
        // Filtrar tarefas
        let tarefasFiltradas = tarefas;
        
        if (filtroAtual === 'ativas') {
            tarefasFiltradas = tarefas.filter(tarefa => !tarefa.completa);
        } else if (filtroAtual === 'completas') {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.completa);
        } else if (filtroAtual === 'pessoal') {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.categoria === 'pessoal');
        } else if (filtroAtual === 'trabalho') {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.categoria === 'trabalho');
        } else if (filtroAtual === 'estudos') {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.categoria === 'estudos');
        }
        
        // Ordenar tarefas
        if (ordenarDataBtn.classList.contains('ativo')) {
            tarefasFiltradas.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
        } else if (ordenarTextoBtn.classList.contains('ativo')) {
            tarefasFiltradas.sort((a, b) => a.texto.localeCompare(b.texto));
        } else if (ordenarStatusBtn.classList.contains('ativo')) {
            tarefasFiltradas.sort((a, b) => a.completa - b.completa);
        }
        
        // Criar elementos da lista
        tarefasFiltradas.forEach(tarefa => {
            const li = document.createElement('li');
            if (tarefa.completa) {
                li.classList.add('completa');
            }
            
            li.classList.add(`categoria-${tarefa.categoria}`);
            
            if (tarefa.dataVencimento && new Date(tarefa.dataVencimento) < new Date()) {
                li.classList.add('tarefa-vencida');
            }
            
            li.innerHTML = `
                <span>${tarefa.texto}</span>
                ${ordenarDataBtn.classList.contains('ativo') ? `<span class="data-criacao">Criada em: ${new Date(tarefa.dataCriacao).toLocaleDateString()}</span>` : ''}
                <div class="acoes">
                    <button class="completar">${tarefa.completa ? 'Reativar' : 'Completar'}</button>
                    <button class="remover">Remover</button>
                </div>
            `;
            
            const completarBtn = li.querySelector('.completar');
            const removerBtn = li.querySelector('.remover');
            
            completarBtn.addEventListener('click', () => completarTarefa(tarefa.id));
            removerBtn.addEventListener('click', () => removerTarefa(tarefa.id));
            
            // Adicionar subtarefas
            if (tarefa.subtarefas && tarefa.subtarefas.length > 0) {
                const subtarefasDiv = document.createElement('div');
                subtarefasDiv.className = 'subtarefas';
                
                tarefa.subtarefas.forEach(subtarefa => {
                    const subtarefaDiv = document.createElement('div');
                    subtarefaDiv.className = `subtarefa ${subtarefa.completa ? 'completa' : ''}`;
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = subtarefa.completa;
                    checkbox.onchange = () => completarSubtarefa(tarefa.id, subtarefa.id);
                    
                    const span = document.createElement('span');
                    span.textContent = subtarefa.texto;
                    
                    const removerBtn = document.createElement('button');
                    removerBtn.textContent = 'Remover';
                    removerBtn.className = 'remover';
                    removerBtn.onclick = () => removerSubtarefa(tarefa.id, subtarefa.id);
                    
                    subtarefaDiv.appendChild(checkbox);
                    subtarefaDiv.appendChild(span);
                    subtarefaDiv.appendChild(removerBtn);
                    subtarefasDiv.appendChild(subtarefaDiv);
                });
                
                li.appendChild(subtarefasDiv);
            }
            
            // Adicionar botão para adicionar subtarefa
            const adicionarSubtarefaBtn = document.createElement('button');
            adicionarSubtarefaBtn.textContent = 'Adicionar Subtarefa';
            adicionarSubtarefaBtn.className = 'adicionar-subtarefa-btn';
            adicionarSubtarefaBtn.onclick = () => {
                const subtarefaInput = adicionarSubtarefa(tarefa.id);
                li.appendChild(subtarefaInput);
            };
            
            li.appendChild(adicionarSubtarefaBtn);
            listaTarefas.appendChild(li);
        });
        
        // Atualizar estatísticas
        const total = tarefas.length;
        const completas = tarefas.filter(t => t.completa).length;
        const pendentes = total - completas;
        
        sumarioEl.textContent = `Total de tarefas: ${total} | Completas: ${completas} | Pendentes: ${pendentes}`;
        atualizarGrafico();
    }
    
    // Função de atualização do gráfico
    function atualizarGrafico() {
        const grafico = document.getElementById('grafico');
        grafico.innerHTML = '';
        
        const total = tarefas.length;
        const completas = tarefas.filter(t => t.completa).length;
        const pendentes = total - completas;
        
        const barraCompletas = document.createElement('div');
        barraCompletas.className = 'barra';
        barraCompletas.style.height = `${(completas / total) * 100}%`;
        barraCompletas.style.backgroundColor = '#4caf50';
        
        const barraPendentes = document.createElement('div');
        barraPendentes.className = 'barra';
        barraPendentes.style.height = `${(pendentes / total) * 100}%`;
        barraPendentes.style.backgroundColor = '#f44336';
        
        grafico.appendChild(barraCompletas);
        grafico.appendChild(barraPendentes);
    }
    
    // Event Listeners
    adicionarBtn.addEventListener('click', adicionarTarefa);
    
    tarefaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adicionarTarefa();
        }
    });
    
    todasBtn.addEventListener('click', () => mudarFiltro('todas'));
    ativasBtn.addEventListener('click', () => mudarFiltro('ativas'));
    completasBtn.addEventListener('click', () => mudarFiltro('completas'));
    pessoalBtn.addEventListener('click', () => mudarFiltro('pessoal'));
    trabalhoBtn.addEventListener('click', () => mudarFiltro('trabalho'));
    estudosBtn.addEventListener('click', () => mudarFiltro('estudos'));
    
    ordenarDataBtn.addEventListener('click', () => {
        ordenarDataBtn.classList.add('ativo');
        ordenarTextoBtn.classList.remove('ativo');
        ordenarStatusBtn.classList.remove('ativo');
        atualizarLista();
    });
    
    ordenarTextoBtn.addEventListener('click', () => {
        ordenarTextoBtn.classList.add('ativo');
        ordenarDataBtn.classList.remove('ativo');
        ordenarStatusBtn.classList.remove('ativo');
        atualizarLista();
    });
    
    ordenarStatusBtn.addEventListener('click', () => {
        ordenarStatusBtn.classList.add('ativo');
        ordenarDataBtn.classList.remove('ativo');
        ordenarTextoBtn.classList.remove('ativo');
        atualizarLista();
    });
    
    // Inicializar a aplicação
    carregarTarefas();
}); 