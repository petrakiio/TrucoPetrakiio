export class Ia {
  constructor(letters) {
    this.letters = [...letters];
  }

  play(cardScores) {
    const manilhas = ['4♣️', '7❤️', 'A♠️', '7♦️'];

    // Prioriza manilhas
    const manilhasNaMao = this.letters.filter(c => manilhas.includes(c));
    
    if (manilhasNaMao.length > 0) {
      // Joga a manilha mais fraca para guardar as fortes
      const sorted = manilhasNaMao.sort((a, b) => cardScores[a] - cardScores[b]);
      return sorted[0];
    }

    // Sem manilha: joga a carta mais forte
    const sorted = this.letters.sort((a, b) => (cardScores[b] || 0) - (cardScores[a] || 0));
    return sorted[0];
  }

  removeCard(card) {
    const idx = this.letters.indexOf(card);
    if (idx !== -1) this.letters.splice(idx, 1);
  }
}
