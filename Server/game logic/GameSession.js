const CardManager = require('../card/cardManager');
class GameSession {
    constructor(roomId, p1Id, p2Id) {
        this.roomId = roomId;
        this.playerIds = [p1Id, p2Id]; 
        this.players = {
            [p1Id]: { 
                id: p1Id, lp: 100,
                deck: CardManager.createTestDeck(), 
                hand: [],
                field: [null, null, null, null, null],
                hasSummoned: false 
            },
            [p2Id]: { 
                id: p2Id, lp: 100, 
                deck: CardManager.createTestDeck(), 
                hand: [],
                field: [null, null, null, null, null],
                hasSummoned: false
            }
        };
        this.currentTurnIndex = 0; 
        this.totalTurns = 1;
        this.initialDraw(p1Id);
        this.initialDraw(p2Id);
    }
    initialDraw(playerId) {
        const player = this.players[playerId];
        player.hand = player.deck.splice(0, 5);
        return player.hand;
    }
    drawCard(playerId) {
        const player = this.players[playerId];
        if (player.deck.length > 0) { 
            const card = player.deck.shift();
            player.hand.push(card);
            return card;
        }
        return null;
    }
    getCurrentPlayerId() {
        return this.playerIds[this.currentTurnIndex];
    }
    executeSummon(playerId, cardIndex) {
        const player = this.players[playerId];
        const card = player.hand[cardIndex];
        const emptySlot = player.field.findIndex(slot => slot === null);
        const maxlv = this.totalTurns / 2 + 0.5;
        if(!card) return false;
        if(card.level > maxlv) return false;
        if (emptySlot !== -1) {
            player.field[emptySlot] = { ...card, hasAttacked: false }; 
            player.hand.splice(cardIndex, 1);
            return true;
        }
        return false;
    }
    executeAttack(playerId, attackerIdx, targetIdx) {
        const player = this.players[playerId];
        const opponentId = this.playerIds.find(id => id !== playerId);
        const opponent = this.players[opponentId];
        const attacker = player.field[attackerIdx];
        if (!attacker || attacker.hasAttacked || this.totalTurns === 1) return false;
        if (targetIdx !== null) {
            const target = opponent.field[targetIdx];
            if (!target) return false;
            target.hp -= attacker.atk;
            attacker.hp -= target.atk;
            if (target.hp <= 0) {
                opponent.field[targetIdx] = null;
            }
            if (attacker.hp <= 0) {
                player.field[attackerIdx] = null;
            }
        } else {
            const isFieldEmpty = opponent.field.every(slot => slot === null);
            if (isFieldEmpty) {
                opponent.lp -= attacker.atk;
            } else {
                return false;
            }
        }
        attacker.hasAttacked = true;
        return true;
    }
    nextTurn() {
        this.currentTurnIndex = (this.currentTurnIndex === 0) ? 1 : 0;
        this.totalTurns++;
        const nextPlayerId = this.getCurrentPlayerId();
        const nextPlayer = this.players[nextPlayerId];
        nextPlayer.hasSummoned = false;
        nextPlayer.field.forEach(monster => {
            if (monster) monster.hasAttacked = false;
        });
        this.drawCard(nextPlayerId);
        return nextPlayerId;
    }
    getGameState(playerId) {
        const opponentId = this.playerIds.find(id => id !== playerId);
        const player = this.players[playerId];
        const opponent = this.players[opponentId];
        let winnerId = null;
        let isDisconnectWin = false; 
        if (player.lp <= 0) {
            player.lp = 0;
            winnerId = opponentId;
        } else if (opponent.lp <= 0) {
            opponent.lp = 0;
            winnerId = playerId;
        }
        const currentPlayerId = this.getCurrentPlayerId();
        if (this.players[currentPlayerId].deck.length === 0 && this.players[currentPlayerId].hand.length === 0) {
            winnerId = this.playerIds.find(id => id !== currentPlayerId);
        }
        return {
            playerField: player.field,
            opponentField: opponent.field,
            playerHand: player.hand,
            playerLp: player.lp,
            opponentLp: opponent.lp,
            currentTurnId: currentPlayerId,
            playerHasSummoned: player.hasSummoned,
            totalTurns: this.totalTurns,
            winnerId: winnerId, 
            isDisconnectWin: isDisconnectWin 
        };
    }
}
module.exports = GameSession;