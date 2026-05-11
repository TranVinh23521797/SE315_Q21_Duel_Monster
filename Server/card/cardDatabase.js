const { MonsterCard } = require('./card');
const cardDatabase = {
    MON_1:  new MonsterCard('mon_1',  'Lôi Chu',  1,  1,  1),
    MON_2:  new MonsterCard('mon_2',  'Kappa',  2,  2,  2),
    MON_3:  new MonsterCard('mon_3',  'Cửu Vĩ Hồ',  3,  3,  3),
    MON_4:  new MonsterCard('mon_4',  'Hắc Báo Tinh',  4,  4,  4),
    MON_5:  new MonsterCard('mon_5',  'Thiết Giáp Ngưu',  5,  5,  5),
    MON_6:  new MonsterCard('mon_6',  'Kim Sí Điểu',  6,  6,  6),
    MON_7:  new MonsterCard('mon_7',  'Kim Quy',  7,  7,  7),
    MON_8:  new MonsterCard('mon_8',  'Ngọc Phượng',  8,  8,  8),
    MON_9:  new MonsterCard('mon_9',  'Hỏa Lân',  9,  9,  9),
    MON_10: new MonsterCard('mon_10', 'Long Vương', 10, 10, 10)
};
module.exports = cardDatabase;