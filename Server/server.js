const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const GameSession = require('./game logic/GameSession');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.static(path.join(__dirname, '../Client')));
let waitingPlayer = null;
let activeMatches = {};
let turnTimer = null;
function startTurnTimeout(roomId) {
    const match = activeMatches[roomId];
    if (!match) return;
    if (match.timer) clearTimeout(match.timer);
    match.timer = setTimeout(() => {
        const currentMatch = activeMatches[roomId];
        if (currentMatch) {
            const state = currentMatch.getGameState(currentMatch.playerIds[0]);
            if (state.winnerId) return clearTimeout(currentMatch.timer);
            console.log(`[TIMEOUT] Phòng ${roomId} hết giờ. Tự động chuyển lượt.`);
            currentMatch.nextTurn();
            currentMatch.playerIds.forEach(pId => {
                io.to(pId).emit('updateState', currentMatch.getGameState(pId));
            });
            startTurnTimeout(roomId);
        }
    }, 30000);
}
io.on('connection', (socket) => {
    if (waitingPlayer) {
        const roomId = `room_${waitingPlayer.id}_${socket.id}`;
        const newMatch = new GameSession(roomId, waitingPlayer.id, socket.id);
        socket.join(roomId);
        waitingPlayer.join(roomId);
        socket.roomId = roomId;
        waitingPlayer.roomId = roomId;
        activeMatches[roomId] = newMatch;
        startTurnTimeout(roomId);
        io.to(waitingPlayer.id).emit('startGame', { 
            hand: newMatch.players[waitingPlayer.id].hand,
            lp: 100, oppLp: 100
        });
        io.to(socket.id).emit('startGame', { 
            hand: newMatch.players[socket.id].hand,
            lp: 100, oppLp: 100
        });
        newMatch.playerIds.forEach(pId => {
            io.to(pId).emit('updateState', newMatch.getGameState(pId));
        });
        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
    }
    socket.on('summonCard', (cardIndex) => {
        const match = activeMatches[socket.roomId];
        if (!match) return;
        const playerId = socket.id;
        const player = match.players[playerId];
        if (match.getCurrentPlayerId() !== playerId || player.hasSummoned) {
            console.log(`[SERVER] Từ chối yêu cầu spam từ: ${playerId}`);
            return; 
        }
        const success = match.executeSummon(playerId, parseInt(cardIndex));
        if (success) {
            match.playerIds.forEach(pId => {
                io.to(pId).emit('updateState', match.getGameState(pId));
            });
            player.hasSummoned = true;
        } else {
            match.playerIds.forEach(pId => {
                io.to(pId).emit('updateState', match.getGameState(pId));
            });
            player.hasSummoned = false;
        }
    });
    socket.on('attack', (data) => {
        const { attackerIdx, targetIdx } = data;
        const match = activeMatches[socket.roomId];
        if (!match) return;
        const playerId = socket.id;
        if (match.getCurrentPlayerId() !== playerId) {
            console.log(`[ATTACK] Từ chối: Không phải lượt của ${playerId}`);
            return;
        }
        const success = match.executeAttack(playerId, attackerIdx, targetIdx);
        if (success) {
            console.log(`[ATTACK] Thành công: Slot ${attackerIdx} tấn công Slot ${targetIdx}`);
            match.playerIds.forEach(pId => {
                io.to(pId).emit('updateState', match.getGameState(pId));
            });
        } else {
            console.log(`[ATTACK] Thất bại: Vi phạm logic game (Lượt 1, quái đã đánh, hoặc mục tiêu sai)`);
        }
    });
    socket.on('endTurn', () => {
        const match = activeMatches[socket.roomId];
        if (match && match.getCurrentPlayerId() === socket.id) {
            match.nextTurn();
            startTurnTimeout(socket.roomId);
            match.playerIds.forEach(pId => {
                io.to(pId).emit('updateState', match.getGameState(pId));
            });
        }
    });
    socket.on('disconnect', () => {
        console.log(`[DISCONNECT] Người chơi ${socket.id} đã rời đi.`);
        const roomId = socket.roomId;
        const match = activeMatches[roomId];
        if (match) {
            const state = match.getGameState(match.playerIds[0]);
            if(state.winnerId === null) {
                const opponentId = match.playerIds.find(id => id !== socket.id);
                if (opponentId) {
                    if (match.timer) clearTimeout(match.timer);
                    io.to(opponentId).emit('updateState', {
                        ...match.getGameState(opponentId),
                        winnerId: opponentId,
                        isDisconnectWin: true 
                    });
                    console.log(`[GAME_OVER] Đối thủ rời phòng. Người thắng: ${opponentId}`);
                }
                delete activeMatches[roomId];
            }
        }
        if (waitingPlayer && waitingPlayer.id === socket.id) {
            waitingPlayer = null;
        }
    });
});

server.listen(3000, '0.0.0.0', () => console.log('Server running on http://localhost:3000'));