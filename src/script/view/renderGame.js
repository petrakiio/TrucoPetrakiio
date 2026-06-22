import { dealCards }                              from "../controller/destributionGame.js";
import { playcard, checkHandWinner, addPoint, checkGameWinner } from "../controller/manageGame.js";
import { Ia }                                     from "../model/ia.js";

let playerDeck = [];
let ia;
const shackles = ['7♦️', '7❤️', '4♣️', 'A♠️'];

/* ── elementos fixos ── */
const result      = document.getElementById('result');
const scoreboard  = (() => {
    let el = document.getElementById('scoreboard');
    if (!el) {
        el = document.createElement('div');
        el.id = 'scoreboard';
        document.body.insertBefore(el, document.body.firstChild.nextSibling);
    }
    return el;
})();

const roundInfo   = (() => {
    let el = document.getElementById('round-info');
    if (!el) {
        el = document.createElement('div');
        el.id = 'round-info';
        document.body.insertBefore(el, scoreboard.nextSibling);
    }
    return el;
})();

/* ── atualiza placar no topo ── */
function updateScoreboard() {
    const p = JSON.parse(localStorage.getItem('playerObj'));
    const i = JSON.parse(localStorage.getItem('iaObj'));
    scoreboard.innerHTML =
        `<span>Você: <b>${p.points}</b> pts</span>` +
        `<span style="margin:0 20px">|</span>` +
        `<span>IA: <b>${i.points}</b> pts</span>`;
}

/* ── atualiza info de rodada ── */
function updateRoundInfo() {
    const s = JSON.parse(localStorage.getItem('statusGame'));
    const p = JSON.parse(localStorage.getItem('playerObj'));
    const ia = JSON.parse(localStorage.getItem('iaObj'));
    roundInfo.innerHTML =
        `Rodada <b>${s.round + 1}/3</b> — Você: ${p.roundWins} vitória(s) | IA: ${ia.roundWins} vitória(s)`;
}

/* ── cria layout inicial de uma mão ── */
function createLayout() {
    const dados = dealCards();
    ia = new Ia(dados.iaDeck);
    playerDeck = dados.playerDeck;

    /* containers de cartas */
    let playerContainer = document.querySelector(".player-cards");
    if (!playerContainer) {
        playerContainer = document.createElement("div");
        playerContainer.className = "player-cards";
        document.body.appendChild(playerContainer);
    }

    let iaContainer = document.querySelector(".ia-cards");
    if (!iaContainer) {
        iaContainer = document.createElement("div");
        iaContainer.className = "ia-cards";
        document.body.appendChild(iaContainer);
    }

    /* cartas viradas da IA */
    iaContainer.innerHTML = "";
    for (let i = 0; i < dados.iaDeck.length; i++) {
        const card = document.createElement("div");
        card.className = "back-card";
        iaContainer.appendChild(card);
    }

    result.innerText = "";
    updateScoreboard();
    updateRoundInfo();
    updateLayout();

    const btn = document.getElementById("btn_start");
    if (btn) btn.remove();
}

/* ── re-renderiza cartas do jogador ── */
function updateLayout() {
    const container = document.querySelector(".player-cards");
    if (!container) return;
    container.innerHTML = "";

    playerDeck.forEach((cardValue, index) => {
        const card = document.createElement("div");
        card.textContent = cardValue;
        card.className = shackles.includes(cardValue) ? "manilha" : "letters-div";

        card.addEventListener("click", () => handleCardClick(cardValue, index));
        container.appendChild(card);
    });
}

/* ── lógica de clique numa carta ── */
function handleCardClick(playerCard, index) {
    const cardScores = JSON.parse(localStorage.getItem('scoresCards'));

    /* IA escolhe e remove a carta */
    const iaCard = ia.play(cardScores);
    ia.removeCard(iaCard);

    /* Remove carta do jogador */
    playerDeck.splice(index, 1);

    /* Atualiza visual da IA */
    const iaContainer = document.querySelector(".ia-cards");
    if (iaContainer.firstChild) iaContainer.removeChild(iaContainer.firstChild);

    /* Avalia rodada */
    const { roundWinner, playerRoundWins, iaRoundWins } = playcard(iaCard, playerCard);

    /* Mostra carta jogada pela IA */
    showPlayedCards(iaCard, playerCard, roundWinner);

    /* Mensagem de rodada */
    if (roundWinner === 'player') {
        result.innerText = `✅ Você ganhou essa rodada! (você: ${playerCard} × IA: ${iaCard})`;
        result.style.color = '#4ade80';
    } else if (roundWinner === 'ia') {
        result.innerText = `❌ IA ganhou essa rodada! (IA: ${iaCard} × você: ${playerCard})`;
        result.style.color = '#f87171';
    } else {
        result.innerText = `🤝 Cangou! (você: ${playerCard} × IA: ${iaCard}) — mostre a maior!`;
        result.style.color = '#facc15';
    }

    updateRoundInfo();

    /* Verifica fim da mão */
    const handWinner = checkHandWinner();
    if (handWinner !== null) {
        setTimeout(() => endHand(handWinner), 900);
        return;
    }

    /* Ainda tem rodadas → atualiza cartas */
    updateLayout();
}

/* ── exibe cartas jogadas no centro ── */
function showPlayedCards(iaCard, playerCard, winner) {
    let arena = document.getElementById('arena');
    if (!arena) {
        arena = document.createElement('div');
        arena.id = 'arena';
        document.body.appendChild(arena);
    }
    const winColor = winner === 'player' ? '#4ade80' : winner === 'ia' ? '#f87171' : '#facc15';
    arena.innerHTML =
        `<div class="played-card ia-played">${iaCard}</div>` +
        `<div class="vs" style="color:${winColor}">VS</div>` +
        `<div class="played-card player-played">${playerCard}</div>`;
    setTimeout(() => { arena.innerHTML = ''; }, 1200);
}

/* ── fim de mão ── */
function endHand(handWinner) {
    addPoint(handWinner);
    updateScoreboard();

    const gameWinner = checkGameWinner();
    if (gameWinner) {
        endGame(gameWinner);
        return;
    }

    if (handWinner === 'player') {
        result.innerText = '🏆 Você ganhou a mão! Nova mão em breve...';
        result.style.color = '#4ade80';
    } else if (handWinner === 'ia') {
        result.innerText = '💀 IA ganhou a mão! Nova mão em breve...';
        result.style.color = '#f87171';
    } else {
        result.innerText = '🤝 Mão empatada! Nova mão em breve...';
        result.style.color = '#facc15';
    }

    /* Limpa cartas e inicia nova mão após 2s */
    setTimeout(() => {
        document.querySelector('.player-cards').innerHTML = '';
        document.querySelector('.ia-cards').innerHTML = '';
        createLayout();
    }, 2000);
}

/* ── fim de jogo ── */
function endGame(winner) {
    document.querySelector('.player-cards').innerHTML = '';
    document.querySelector('.ia-cards').innerHTML = '';

    const msg = winner === 'player'
        ? '🎉 VOCÊ GANHOU O JOGO! Parabéns!'
        : '💀 IA GANHOU O JOGO! Tente novamente.';
    result.innerText = msg;
    result.style.color = winner === 'player' ? '#4ade80' : '#f87171';
    result.style.fontSize = '1.6rem';

    const restartBtn = document.createElement('button');
    restartBtn.id = 'btn_start';
    restartBtn.textContent = 'Jogar Novamente';
    restartBtn.addEventListener('click', () => {
        localStorage.clear();
        result.innerText = '';
        result.style.fontSize = '';
        roundInfo.innerHTML = '';
        scoreboard.innerHTML = '';
        restartBtn.remove();
        createLayout();
    });
    document.body.appendChild(restartBtn);
}

/* ── inicia ── */
document.getElementById("btn_start").addEventListener("click", createLayout);
