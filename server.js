const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server).sockets;

app.get("/",(req,res)=>{
    res.sendFile("d:/VStudio/LetsChat/index.html");
});

let connectedUser = [];

//Socket.io connect
io.on("connection", socket => {
    console.log("a user connected");
    updateUserName();
    let userName = '';
    //Login
    socket.on('login',(name,callback) =>{
        if(name.trim().length===0){
            return;
        }
        callback(true);
        userName = name;
        connectedUser.push(userName);
        //console.log(connectedUser);

        updateUserName();
    });

    //Recive Chat Message
    socket.on('chat message',msg=>{
        //console.log(msg);

        io.emit('output',{
            name:userName,
            msg:msg
        });
    })

    //Disconnect
    socket.on("disconnect", () => {
        console.log("user disconnected");
        connectedUser.splice(connectedUser.indexOf(userName),1);
        //console.log(connectedUser);
        updateUserName();
    });

    //Update username
    function updateUserName(){
        io.emit('loadUser',connectedUser);
    }
});

const port = process.env.port || 5000;
server.listen(port,() => console.log(`Server running on port ${port}`));