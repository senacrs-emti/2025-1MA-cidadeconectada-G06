document.addEventListener('DOMContentLoaded', function() {
    const carrosselContainer = document.querySelector('.cc'); 
    const carrosselFaixa = document.querySelector('.cc .cf'); 
    const carrosselItens = document.querySelectorAll('.cc .cf .ci'); 
    const botaoProximo = document.querySelector('.carrossel-botao.proximo'); 
    const botaoAnterior = document.querySelector('.carrossel-botao.anterior'); 

    if (!carrosselFaixa || carrosselItens.length === 0 || !botaoProximo || !botaoAnterior) {
        console.error("Um ou mais elementos do carrossel não foram encontrados.");
        return;
    }

    // O número de itens que duplicamos em cada lado (para o loop)
    // Baseado na sua estrutura CSS, onde 4 itens cabem na tela.
    const itensClonados = 4; 
    
    // O número total de itens originais (9 no seu caso)
    const totalItensOriginais = carrosselItens.length - (itensClonados * 2); 
    
    // O índice inicial deve ser o primeiro item ORIGINAL, ignorando as cópias iniciais.
    let indiceAtual = itensClonados; // Começa no índice 4 (o 5º item real)

    let larguraItemComGap = 0;

    /**
     * Função para mover a faixa.
     * @param {boolean} comTransicao - Se deve usar a transição (rolagem suave) ou fazer um salto instantâneo.
     */
    function atualizarCarrossel(comTransicao = true) {
        // 1. CALCULAR DIMENSÕES (Ajusta o tamanho real do movimento)
        if (carrosselItens.length > 0) {
            const itemLargura = carrosselItens[0].offsetWidth; 
            const gapStyle = window.getComputedStyle(carrosselFaixa).getPropertyValue('gap');
            const gap = parseInt(gapStyle) || 20; 
            larguraItemComGap = itemLargura + gap; 
        }

        // Configura a transição: suave (0.3s) ou instantânea (0s)
        carrosselFaixa.style.transition = comTransicao ? 'transform 0.3s ease-in-out' : 'none';

        // 2. APLICAR DESLOCAMENTO
        const deslocamento = indiceAtual * larguraItemComGap; 
        carrosselFaixa.style.transform = `translateX(-${deslocamento}px)`;
    }

    /**
     * Função que aplica o "teletransporte" silencioso após a rolagem.
     */
    function verificarLoop() {
        // Se a rolagem suave acabou...
        if (indiceAtual === 0) {
            // Se chegamos no primeiro CLONE (índice 0), saltamos para o último ITEM ORIGINAL.
            indiceAtual = totalItensOriginais; 
            atualizarCarrossel(false); // Salto instantâneo (sem transição)
        } else if (indiceAtual === totalItensOriginais + itensClonados) {
            // Se chegamos no último CLONE, saltamos para o primeiro ITEM ORIGINAL.
            indiceAtual = itensClonados;
            atualizarCarrossel(false); // Salto instantâneo (sem transição)
        }
    }

    // --- Event Listeners para Botões ---
    botaoProximo.addEventListener('click', () => {
        // Impede cliques se o carrossel ainda estiver rolando
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

    // --- Event Listener para Transição (Crucial para o Loop) ---
    // Verifica se o carrossel terminou a rolagem suave para aplicar o salto.
    carrosselFaixa.addEventListener('transitionend', () => {
        carrosselFaixa.classList.remove('rolling');
        verificarLoop();
    });

    // Inicializa o carrossel na posição do primeiro item original (índice 4)
    atualizarCarrossel(false); // Inicia com salto instantâneo
});