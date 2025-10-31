 // 1. Seleciona os elementos principais
const faixa = document.querySelector('.cf');
const botaoAnterior = document.querySelector('.cba');
const botaoProximo = document.querySelector('.carrossel-botao.proximo');
const itemLargura = 250; // Deve ser a mesma largura definida no CSS (250px)
const gap = 20; // O gap definido no CSS (20px)

let deslocamentoAtual = 0; // Posição atual do carrossel

// 2. Adiciona o evento de clique ao botão PRÓXIMO
botaoProximo.addEventListener('click', () => {
    // Calcula a largura de um item mais o espaço (gap)
    const passo = itemLargura + gap; 
    
    // Obtém a largura total da faixa de itens (incluindo o que está escondido)
    const larguraTotalFaixa = faixa.scrollWidth;

    // Obtém a largura visível do container
    const larguraVisivelContainer = faixa.clientWidth;
    
    // Calcula o deslocamento máximo que a faixa pode ter para mostrar o último item
    const deslocamentoMaximo = larguraTotalFaixa - larguraVisivelContainer;

    // Se o novo deslocamento (movimento) for maior que o máximo, pare no máximo.
    if (deslocamentoAtual < deslocamentoMaximo) {
        // Incrementa o deslocamento no passo de um item
        deslocamentoAtual += passo;

        // Se o novo deslocamento passar o limite, ajuste para o máximo para não sobrar espaço vazio.
        if (deslocamentoAtual > deslocamentoMaximo) {
            deslocamentoAtual = deslocamentoMaximo;
        }

        // Aplica a transformação CSS para mover a faixa
        faixa.style.transform = `translateX(-${deslocamentoAtual}px)`;
    }
});


// 3. Adiciona o evento de clique ao botão ANTERIOR
botaoAnterior.addEventListener('click', () => {
    const passo = itemLargura + gap;

    // Se o deslocamento atual não for zero (ou seja, ainda não está no início)
    if (deslocamentoAtual > 0) {
        // Decrementa o deslocamento
        deslocamentoAtual -= passo;

        // Garante que o deslocamento não seja negativo (fica em zero se passar)
        if (deslocamentoAtual < 0) {
            deslocamentoAtual = 0;
        }

        // Aplica a transformação CSS para mover a faixa de volta
        faixa.style.transform = `translateX(-${deslocamentoAtual}px)`;
    }
});