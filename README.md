# SE315_Q21_Duel_Monster

- Nhóm 3
- Trần Vinh - 23521797
- GV: Đặng Việt Dũng

Một trò chơi thẻ bài đấu trí trực tuyến (multiplayer) được xây dựng trên nền tảng Web, cho phép người chơi triệu hồi quái vật và chiến đấu trong thời gian thực.

## Tính năng chính
- **Multiplayer Real-time**: Kết nối người chơi thông qua Socket.io.
- **Hệ thống thẻ bài**: Cơ chế quản lý thẻ bài (ATK/HP) từ database riêng.
- **Bàn chơi chiến thuật**: Hệ thống sân đấu với 5 vị trí đặt quái vật (slots).
- **Game Logic**: Xử lý lượt đi (turn management), triệu hồi và tính toán sát thương phía Server.

## Cấu trúc Project
- **/Client**: Giao diện người chơi (HTML, CSS, JavaScript thuần).
- **/Server**: 
  - `server.js`: Điểm khởi chạy ứng dụng và quản lý kết nối Socket.
  - `/card`: Quản lý dữ liệu thẻ bài (`cardDatabase.js`) và lớp đối tượng Card.
  - `/game logic`: Xử lý các phiên trận đấu (`GameSession.js`).

## Công nghệ sử dụng
- **Frontend**: HTML5, CSS3, JavaScript.
- **Backend**: Node.js, Express.
- **Real-time**: Socket.io.
- **Database**: Hệ thống quản lý dữ liệu JSON/Object cho thẻ bài.

## Cài đặt và Chạy thử
- Cài đặt các thư viện cần thiết: npm install
- Chạy Server: node server.js
- Trải nghiệm: Mở trình duyệt và truy cập vào http://localhost:3000
- <img width="1175" height="860" alt="image" src="https://github.com/user-attachments/assets/0e07e175-a626-49e7-b80f-3ba44c6a5870" />
