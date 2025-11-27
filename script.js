document.addEventListener('DOMContentLoaded', function() {
    // ===============================================
    // 1. LÓGICA DO CARROSSEL (Continua funcionando)
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
    // 2. LÓGICA DO MODAL DE FEEDBACKS (Com Correções)
    // ===============================================

    // Seletores de elementos do Modal
    const mainContent = document.querySelector('main');
    const footerContent = document.querySelector('footer');

    const modalFeedback = document.getElementById('modalFeedback');
    const modalVisualizacao = document.getElementById('modalVisualizacao');
    const modalSobreNos = document.getElementById('modalSobreNos');
    const abrirSobreNosBtn = document.getElementById('abrirSobreNos');
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
        if (ativo) {
            if (mainContent) mainContent.classList.add('blurry-background');
            if (footerContent) footerContent.classList.add('blurry-background');
        } else {
            if (mainContent) mainContent.classList.remove('blurry-background');
            if (footerContent) footerContent.classList.remove('blurry-background');
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
    // CORREÇÃO: Adicionamos a checagem if(abrirFeedbackBtn) para evitar erro caso o HTML não carregue
    if (abrirFeedbackBtn) {
        abrirFeedbackBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            abrirModal(modalFeedback);
        });
    }
    if (abrirSobreNosBtn) {
    abrirSobreNosBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        abrirModal(modalSobreNos);
    });
    }

    if (abrirVisualizacaoBtn) {
        abrirVisualizacaoBtn.addEventListener('click', () => {
            abrirModal(modalVisualizacao);
            carregarFeedbacks(); 
        });
    }

    // --- Eventos de Fechamento (Botão X) ---
    // Esta parte foi refeita para garantir que todos os botões 'X' funcionem.
    fecharModais.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = btn.getAttribute('data-modal-id');
            const modalParaFechar = document.getElementById(modalId);
            
            if (modalParaFechar) {
                fecharModal(modalParaFechar);
            }
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
    if (anonimoCheck) {
        anonimoCheck.addEventListener('change', () => {
            if (anonimoCheck.checked) {
                inputNome.value = '';
                inputNome.disabled = true;
                inputNome.placeholder = 'Anônimo';
            } else {
                inputNome.disabled = false;
                inputNome.placeholder = 'Nome';
            }
        });
    }


    // --- Lógica de Submissão e Salvamento (localStorage) ---
    if (formFeedback) {
        formFeedback.addEventListener('submit', (e) => {
            e.preventDefault();

            if (inputMensagem.value.trim() === '') {
                alert('Por favor, escreva um feedback antes de enviar.');
                return;
            }

            let nomeUsuario = inputNome.value.trim();
            if (anonimoCheck.checked || nomeUsuario === '') {
                nomeUsuario = 'Anônimo';
            }

            const novoFeedback = {
                nome: nomeUsuario,
                mensagem: inputMensagem.value.trim(),
                data: new Date().toLocaleString('pt-BR')
            };

            const feedbacksSalvosJSON = localStorage.getItem('pipaFeedbacks');
            const feedbacks = feedbacksSalvosJSON ? JSON.parse(feedbacksSalvosJSON) : [];
            
            feedbacks.unshift(novoFeedback); 
            localStorage.setItem('pipaFeedbacks', JSON.stringify(feedbacks));

            alert('Obrigado! Seu feedback foi enviado.');
            inputMensagem.value = '';
            inputNome.value = '';
            anonimoCheck.checked = false;
            inputNome.disabled = false;
            inputNome.placeholder = 'Nome';

            fecharModal(modalFeedback);
        });
    }

    // --- Lógica de Visualização ---
    function carregarFeedbacks() {
        if (!listaFeedbacksDiv) return;

        listaFeedbacksDiv.innerHTML = ''; 

        const feedbacksSalvosJSON = localStorage.getItem('pipaFeedbacks');
        const feedbacks = feedbacksSalvosJSON ? JSON.parse(feedbacksSalvosJSON) : [];
        
        if (feedbacks.length === 0) {
            listaFeedbacksDiv.innerHTML = '<p style="text-align: center;">Ainda não há feedbacks para mostrar.</p>';
            return;
        }

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