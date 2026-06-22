export function playcard(iaCard, playerCard) {
    const cardScores = JSON.parse(localStorage.getItem('scoresCards'));

    const iacardValue   = cardScores[iaCard]     ?? 0;
    const playcardValue = cardScores[playerCard] ?? 0;

    let roundWinner;
    if (iacardValue > playcardValue) {
        roundWinner = 'ia';
    } else if (playcardValue > iacardValue) {
        roundWinner = 'player';
    } else {
        roundWinner = 'cangou';
    }

    // Atualiza rodada e pontuações no localStorage
    const status = JSON.parse(localStorage.getItem('statusGame'));
    const playerObj = JSON.parse(localStorage.getItem('playerObj'));
    const iaObj     = JSON.parse(localStorage.getItem('iaObj'));

    status.round += 1;

    if (roundWinner === 'player') {
        playerObj.roundWins += 1;
    } else if (roundWinner === 'ia') {
        iaObj.roundWins += 1;
    }

    localStorage.setItem('statusGame', JSON.stringify(status));
    localStorage.setItem('playerObj',  JSON.stringify(playerObj));
    localStorage.setItem('iaObj',      JSON.stringify(iaObj));

    return { roundWinner, round: status.round, playerRoundWins: playerObj.roundWins, iaRoundWins: iaObj.roundWins };
}

export function checkHandWinner() {
    const playerObj = JSON.parse(localStorage.getItem('playerObj'));
    const iaObj     = JSON.parse(localStorage.getItem('iaObj'));
    const status    = JSON.parse(localStorage.getItem('statusGame'));

    // Ganha a mão quem vencer 2 rodadas, ou na rodada 3 quem tiver mais vitórias
    if (playerObj.roundWins >= 2) return 'player';
    if (iaObj.roundWins >= 2)     return 'ia';
    if (status.round >= 3) {
        if (playerObj.roundWins > iaObj.roundWins) return 'player';
        if (iaObj.roundWins > playerObj.roundWins) return 'ia';
        return 'empate';
    }
    return null; // mão ainda em andamento
}

export function addPoint(winner) {
    if (!winner || winner === 'empate') return;
    const key = winner === 'player' ? 'playerObj' : 'iaObj';
    const obj = JSON.parse(localStorage.getItem(key));
    obj.points += 1;
    localStorage.setItem(key, JSON.stringify(obj));
}

export function checkGameWinner() {
    const playerObj = JSON.parse(localStorage.getItem('playerObj'));
    const iaObj     = JSON.parse(localStorage.getItem('iaObj'));
    if (playerObj.points >= 12) return 'player';
    if (iaObj.points     >= 12) return 'ia';
    return null;
}
