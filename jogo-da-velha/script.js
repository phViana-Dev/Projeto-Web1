document.addEventListener('DOMContentLoaded', () => {
    const containerTabuleiro = document.getElementById('tabuleiro');
    const selectTamanhoTabuleiro = document.getElementById('tamanho-tabuleiro');
    const botaoReiniciar = document.getElementById('botao-reiniciar');
    const jogadorAtualDiv = document.getElementById('jogador-atual');

    let tamanhoTabuleiro = parseInt(selectTamanhoTabuleiro.value, 10);
    let jogadorAtual = 'X';
    let tabuleiroJogo = criarTabuleiroVazio(tamanhoTabuleiro);
    let ultimaJogada = { linha: null, coluna: null, jogador: null };

    function criarTabuleiroVazio(tamanho) {
        return Array.from({ length: tamanho }, () => Array(tamanho).fill(''));
    }

    function verificarVencedor(linha, coluna) {
        if (
            verificarSequencia(tabuleiroJogo[linha]) ||
            verificarSequencia(obterColuna(coluna)) ||
            verificarDiagonal() ||
            verificarAntiDiagonal()
        ) {
            return true;
        }

        return false;
    }

    function verificarDiagonal() {
        const diagonal = Array.from({ length: tamanhoTabuleiro }, (_, i) => tabuleiroJogo[i][i]);
        return verificarSequencia(diagonal);
    }

    function verificarAntiDiagonal() {
        const antiDiagonal = Array.from({ length: tamanhoTabuleiro }, (_, i) => tabuleiroJogo[i][tamanhoTabuleiro - 1 - i]);
        return verificarSequencia(antiDiagonal);
    }

    function verificarSequencia(array) {
        let count = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] === jogadorAtual) {
                count++;
                if (count === tamanhoTabuleiro) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
        return false;
    }

    function obterColuna(coluna) {
        return Array.from({ length: tamanhoTabuleiro }, (_, i) => tabuleiroJogo[i][coluna]);
    }

    function lidarComCliqueCelula(evento) {
        const linha = parseInt(evento.target.dataset.linha, 10);
        const coluna = parseInt(evento.target.dataset.coluna, 10);

        if (tabuleiroJogo[linha][coluna] === '') {
            tabuleiroJogo[linha][coluna] = jogadorAtual;
            ultimaJogada = { linha, coluna, jogador: jogadorAtual };
            renderizarTabuleiro();

            if (verificarVencedor(linha, coluna)) {
                setTimeout(() => {
                    alert(`Temos um vencedor! Última jogada: ${ultimaJogada.jogador} na posição (${ultimaJogada.linha}, ${ultimaJogada.coluna})`);
                    reiniciarJogo();
                }, 100);
            } else if (verificarEmpate()) {
                alert("O jogo empatou!");
                reiniciarJogo();
            } else {
                jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
                atualizarJogadorAtual();
            }
        }
    }

    function verificarEmpate() {
        return tabuleiroJogo.flat().every(celula => celula !== '');
    }

    function renderizarTabuleiro() {
        containerTabuleiro.innerHTML = '';

        // Adicionando elemento para mostrar o jogador atual acima da tabela
        jogadorAtualDiv.textContent = `Jogador Atual: ${jogadorAtual}`;

        containerTabuleiro.style.setProperty('--tamanho-tabuleiro', tamanhoTabuleiro);

        for (let linha = 0; linha < tamanhoTabuleiro; linha++) {
            for (let coluna = 0; coluna < tamanhoTabuleiro; coluna++) {
                const celula = document.createElement('div');
                celula.className = 'celula';
                celula.dataset.linha = linha;
                celula.dataset.coluna = coluna;
                celula.textContent = tabuleiroJogo[linha][coluna];

                if (linha === ultimaJogada.linha && coluna === ultimaJogada.coluna) {
                    celula.classList.add('ultima-jogada');
                }

                celula.addEventListener('click', lidarComCliqueCelula);
                containerTabuleiro.appendChild(celula);
            }
        }
    }

    function atualizarJogadorAtual() {
        jogadorAtualDiv.textContent = `Jogador Atual: ${jogadorAtual}`;
    }

    function reiniciarJogo() {
        tamanhoTabuleiro = parseInt(selectTamanhoTabuleiro.value, 10);
        tabuleiroJogo = criarTabuleiroVazio(tamanhoTabuleiro);
        jogadorAtual = 'X';
        ultimaJogada = { linha: null, coluna: null, jogador: null };
        renderizarTabuleiro();
        atualizarJogadorAtual();
    }

    botaoReiniciar.addEventListener('click', reiniciarJogo);
    selectTamanhoTabuleiro.addEventListener('change', reiniciarJogo);

    renderizarTabuleiro();
});
