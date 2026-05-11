const cardDatabase = require('./cardDatabase');
class CardManager {
    static createTestDeck() {
        let deck = [];
        Object.keys(cardDatabase).forEach(key => {
            const cardTemplate = cardDatabase[key];
            if(key== 'MON_1') {
                for (let i = 0; i < 10; i++) {
                    deck.push({ ...cardTemplate });
                }
            }
            else if (key === 'MON_2'|| key === 'MON_3'|| key === 'MON_4'|| key === 'MON_5'|| key === 'MON_6') {
                for (let i = 0; i < 4; i++) {
                    deck.push({ ...cardTemplate });
                }
            }
            else if(key === 'MON_7'|| key === 'MON_8'|| key === 'MON_9') {
                for (let i = 0; i < 3; i++) {
                    deck.push({ ...cardTemplate });
                }
            }
            else deck.push({ ...cardTemplate });
        });
        return deck.sort(() => Math.random() - 0.5);
    }
}
module.exports = CardManager;