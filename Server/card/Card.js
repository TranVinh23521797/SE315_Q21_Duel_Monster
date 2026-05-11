class Card {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}
class MonsterCard extends Card {
    constructor(id, name, atk, hp, level) {
        super(id, name, 'Monster');
        this.atk = atk;
        this.hp = hp;
        this.level = level;
    }
}
module.exports = { Card, MonsterCard };