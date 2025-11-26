document.addEventListener('DOMContentLoaded', function() {
    // ===============================================
    // 1. LÓGICA DO CARROSSEL (Versão Contínua/Loop)
    // Mantenha esta parte do código que já está funcionando
    // ===============================================
    
    const carrosselContainer = document.querySelector('.cc'); 
    const carrosselFaixa = document.querySelector('.cc .cf'); 
    const carrosselItens = document.querySelectorAll('.cc .cf .ci'); 
    const botaoProximo = document.querySelector('.carrossel-botao.proximo'); 
    const botaoAnterior = document.querySelector('.carrossel-botao.anterior'); 

    if (carrosselFaixa && carrosselItens.length > 0 && botaoProximo && botaoAnterior) {
        const itensClonados = 4; 
        const totalItensOriginais = carrosselItens.length - (itensClonados * 2); 
        let indiceAtual = itensClonados;
        let larguraItemComGap = 0;

        function atualizarCarrossel(comTransicao = true) {
            if (carrosselItens.length > 0) {
                const itemLargura = carrosselItens[0].offsetWidth; 
                const gapStyle = window.getComputedStyle(carrosselFaixa).getPropertyValue('gap');
                const gap = parseInt(gapStyle) || 20; 
                larguraItemComGap = itemLargura + gap; 
            }

            carrosselFaixa.style.transition = comTransicao ? 'transform 0.3s ease-in-out' : 'none';
            const deslocamento = indiceAtual * larguraItemComGap; 
            carrosselFaixa.style.transform = `translateX(-${deslocamento}px)`;
        }

        function verificarLoop() {
            if (indiceAtual === 0) {
                indiceAtual = totalItensOriginais; 
                atualizarCarrossel(false); 
            } else if (indiceAtual === totalItensOriginais + itensClonados) {
                indiceAtual = itensClonados;
                atualizarCarrossel(false); 
            }
        }

        botaoProximo.addEventListener('click', () => {
            if (carrosselFaixa.classList.contains('rolling')) return; 
            carrosselFaixa.classList.add('rolling');
            indiceAtual++;
            atualizarCarrossel(true);
        });

        botaoAnterior.addEventListener('click', () => {
            if (carrosselFaixa.classList.contains('rolling')) return; 
            carrosselFaixa.classList.add('rolling');
            indiceAtual--;
            atualizarCarrossel(true);
        });

        carrosselFaixa.addEventListener('transitionend', () => {
            carrosselFaixa.classList.remove('rolling');
            verificarLoop();
        });

        atualizarCarrossel(false);
        window.addEventListener('resize', atualizarCarrossel);
    }
    
    // ===============================================
    // 2. LÓGICA DO MODAL DE FEEDBACKS (NOVO)
    // ===============================================

    // Seletores de elementos do Modal
    const mainContent = document.querySelector('main');
    const footerContent = document.querySelector('footer');

    const modalFeedback = document.getElementById('modalFeedback');
    const modalVisualizacao = document.getElementById('modalVisualizacao');
    const abrirFeedbackBtn = document.getElementById('abrirFeedback');
    const abrirVisualizacaoBtn = document.getElementById('abrirVisualizacao');
    const fecharModais = document.querySelectorAll('.fechar-modal');
    
    const formFeedback = document.getElementById('formFeedback');
    const inputNome = document.getElementById('inputNome');
    const inputMensagem = document.getElementById('inputMensagem');
    const anonimoCheck = document.getElementById('anonimoCheck');
    const listaFeedbacksDiv = document.getElementById('listaFeedbacks');
    
    // --- Funções de Abertura/Fechamento ---
    function toggleBlur(ativo) {
        // Aplica/Remove a classe de desfoque nos elementos Main e Footer
        if (ativo) {
            mainContent.classList.add('blurry-background');
            footerContent.classList.add('blurry-background');
        } else {
            mainContent.classList.remove('blurry-background');
            footerContent.classList.remove('blurry-background');
        }
    }

    function abrirModal(modal) {
        modal.style.display = 'flex';
        toggleBlur(true);
    }

    function fecharModal(modal) {
        modal.style.display = 'none';
        toggleBlur(false);
    }

    // --- Eventos de Abertura ---
    abrirFeedbackBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Evita que o link # no cabeçalho role a página
        abrirModal(modalFeedback);
    });

    abrirVisualizacaoBtn.addEventListener('click', () => {
        abrirModal(modalVisualizacao);
        carregarFeedbacks(); // Carrega os feedbacks antes de abrir
    });

    // --- Eventos de Fechamento (Botão X) ---
    fecharModais.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = btn.getAttribute('data-modal-id');
            // Linha de verificação:
            console.log('Tentando fechar o modal com ID:', modalId); 
            
            fecharModal(document.getElementById(modalId));
        });
    });
    

    // --- Fechamento ao clicar fora do Modal ---
    window.addEventListener('click', (e) => {
        if (e.target === modalFeedback) {
            fecharModal(modalFeedback);
        }
        if (e.target === modalVisualizacao) {
            fecharModal(modalVisualizacao);
        }
    });

    // --- Lógica do Checkbox Anônimo ---
    anonimoCheck.addEventListener('change', () => {
        // Se Anônimo estiver marcado, desabilita e limpa o campo Nome
        if (anonimoCheck.checked) {
            inputNome.value = '';
            inputNome.disabled = true;
            inputNome.placeholder = 'Anônimo';
        } else {
            inputNome.disabled = false;
            inputNome.placeholder = 'Nome';
        }
    });

    // --- Lógica de Submissão e Salvamento (localStorage) ---
    formFeedback.addEventListener('submit', (e) => {
        e.preventDefault();

        if (inputMensagem.value.trim() === '') {
            alert('Por favor, escreva um feedback antes de enviar.');
            return;
        }

        // 1. Coletar dados
        let nomeUsuario = inputNome.value.trim();
        
        if (anonimoCheck.checked || nomeUsuario === '') {
            nomeUsuario = 'Anônimo';
        }

        const novoFeedback = {
            nome: nomeUsuario,
            mensagem: inputMensagem.value.trim(),
            data: new Date().toLocaleString('pt-BR')
        };

        // 2. Carregar feedbacks existentes
        const feedbacksSalvosJSON = localStorage.getItem('pipaFeedbacks');
        const feedbacks = feedbacksSalvosJSON ? JSON.parse(feedbacksSalvosJSON) : [];
        
        // 3. Adicionar o novo e salvar (Permite múltiplos envios)
        feedbacks.unshift(novoFeedback); // Adiciona no início (mais recente primeiro)
        localStorage.setItem('pipaFeedbacks', JSON.stringify(feedbacks));

        // 4. Limpar e fechar
        alert('Obrigado! Seu feedback foi enviado.');
        inputMensagem.value = '';
        inputNome.value = '';
        anonimoCheck.checked = false;
        inputNome.disabled = false;
        inputNome.placeholder = 'Nome';

        fecharModal(modalFeedback);
    });

    // --- Lógica de Visualização ---
    function carregarFeedbacks() {
        // Limpa a lista antes de recarregar
        listaFeedbacksDiv.innerHTML = ''; 

        const feedbacksSalvosJSON = localStorage.getItem('pipaFeedbacks');
        const feedbacks = feedbacksSalvosJSON ? JSON.parse(feedbacksSalvosJSON) : [];
        
        if (feedbacks.length === 0) {
            listaFeedbacksDiv.innerHTML = '<p style="text-align: center;">Ainda não há feedbacks para mostrar.</p>';
            return;
        }

        // Gera o HTML para cada feedback
        feedbacks.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.classList.add('feedback-item');
            
            feedbackItem.innerHTML = `
                <div class="feedback-data">Em: ${feedback.data}</div>
                <div class="feedback-nome">${feedback.nome}</div>
                <p>${feedback.mensagem}</p>
            `;
            listaFeedbacksDiv.appendChild(feedbackItem);
        });
    }

});