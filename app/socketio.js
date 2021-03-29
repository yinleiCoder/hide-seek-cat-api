/**
 * socket.io即时通讯
 * https://socket.io/docs/v4/server-socket-instance/ 
 */
module.exports = (io) => {
    let users = {};
    io.on('connection', socket => {
        console.log(`用户${socket.id}连接到了socket.io`);
        socket.on('login', (uid) => {
            socket.name = uid;
            users[uid] = socket.id;
        });
        socket.on('chat_text', (content, fromid, toid) => {
            console.log(content, toid, users[toid], users);
            socket.to(users[toid]).emit('chat_text', content, fromid);
        });
        /// 用户离开
        socket.on("disconnecting", () => {
            if(users.hasOwnProperty(socket.name)) {
                delete users[socket.name];
                console.log(socket.id+'离开了')
            }
        });
    });
}