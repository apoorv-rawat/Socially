class ChatEngine{
    constructor(chatBoxId, userEmail, userName) {
        // string interpolation
        this.chatBox = $(`#${chatBoxId}`);
        this.chatMsgList = $(`#${chatBoxId} #chat-messages-list`); 
        this.userEmail = userEmail;
        
        // io global object - socketio.js - sends the request here
        this.socket = io.connect('http://localhost:5000');
        
        // why?
        if(this.userEmail) {
            this.connectionHandler(userEmail, userName);
        }

        // outer object reference
        let objRef = this;

        // adding click event for send
        // let sendBtn = $(`#${chatBoxId} #chat-message-input-container #send-message`);
        let inputField = $(`#${chatBoxId} #chat-message-input-container #chat-message-input`);
        let socketInstance = this.socket;

        inputField.keypress(function (e) {
            if(e.which == 13) {
                e.preventDefault();
                let msg = inputField.val();
                let cliData = {
                    name: "You",
                    email: userEmail,
                    roomName: 'socially_global'
                }

                if(msg) {
                    inputField.val("");
                    socketInstance.emit('send', {msg : msg, roomName: cliData.roomName });

                    objRef.addToDom({ 
                                user: cliData, 
                                msg: msg 
                            },
                            "self-message");
                }
            }
        });

        // sendBtn.click(function (e) {
        // });
    }

    // function of a class
    addToDom(data, type, alert) {

        let newMsg = $("<li><span>Other message</span></li>");

        if(alert) {
            newMsg.children().text(data.msg);
        }else {
            newMsg.children().text(`${data.user.name}: ${data.msg}`);
        }
        newMsg.addClass(type);
        newMsg.appendTo(this.chatMsgList);

        this.chatMsgList.scrollTop(this.chatMsgList.prop("scrollHeight"));
        // https://api.jquery.com/jQuery/#:~:text=Creating%20New%20Elements
    }

    connectionHandler(clientEmail, clientName) {
        // self refers to the object ChatEngine console.log('self is ', this);
        let self = this;  
        let clientSocket = this.socket;

        // attaching listener / event on socket
        clientSocket.on('connect', function() {
            console.log('Client connection established using sockets!');

            // console.log('here this is ',this);
            // here this refers to this.socket, since callback called with ref to socket console.log(clientSocket == this);

            // emits join_room 
            this.emit('join_room', {
                email: clientEmail,
                roomName: 'socially_global',
                name: clientName
            });

        });

        // https://socket.io/docs/v4/client-socket-instance/#:~:text=Please%20note%20that%20you%20shouldn%27t%20register%20event%20handlers%20in%20the%20connect%20handler%20itself%2C%20as%20a%20new%20handler%20will%20be%20registered%20every%20time%20the%20Socket%20reconnects%3A
        clientSocket.on('user_joined', function (name) {
            self.addToDom({
                user: {
                    name: name
                },
                msg: `${name} joined the room!`
            },"self-message alert",true);
        });

        clientSocket.on('user_left', (name) => {
            self.addToDom({
                user: {
                    name: name
                },
                msg: `${name} left the room!`
            },"self-message alert",true);

        });

        //receiving message from a sender
        clientSocket.on('rec', (packet) => {
            self.addToDom(packet,"other-message");
        });

        clientSocket.on('welcome', (room) => {
            self.addToDom({
                user: {
                    name: ""
                },
                msg: `Welcome to the ${room} chat room!`
            },"self-message alert",true);

        });
    }
}
