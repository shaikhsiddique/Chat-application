const express = require('express');
const http = require('http');
const path = require('path');
const socket_io = require('socket.io');
require('dotenv').config();
const cookie_parser = require('cookie-parser');



const db = require('./config/db-connection');
const login_route = require('./routes/login-route');
const signup_route = require('./routes/signup-route');
const logout_route = require('./routes/logout-route');
const create_group_route = require('./routes/create-group-route');
const join_group_route = require('./routes/join-group-route');
const isLoggedIn = require('./middlewares/isLoggedIn');
const { groupModel } = require('./models/group-model');
const { userModel } = require('./models/user-model');


const app = express();
const server = http.createServer(app);
const io = socket_io(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookie_parser());


io.on('connection', (socket) => {
    
    socket.on('show-chat', async ({ id, name, user }) => {
        socket.join(name);
        socket.broadcast.to(name).emit('user-joined', {
            group: name,
            user: user,
            message: `${user} has joined the room ${name}`
        });
    });
    socket.on('send-message', async ({ user, message, group }) => {
        socket.broadcast.to(group).emit('recived-message', { user, message });
    });
    
    
});

app.get('/',isLoggedIn,async  (req, res) => {
    const group = await groupModel.find();
    const user = await userModel.findById(req.user);
    res.render("index.ejs", {groups: group,user : user});
});

app.use('/login', login_route);
app.use('/signup', signup_route); 
app.use('/logout',logout_route);
app.use('/create-group',isLoggedIn,create_group_route);
app.use('/join-group',isLoggedIn,join_group_route);

  
server.listen(process.env.PORT || 3000, () => {
});
