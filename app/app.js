// Get the user name first.
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username')

let user = username;
console.log(user);
if(user != null){
    const messageForm = document.getElementById("messageForm");
    const socket = io('ws://localhost:8080');

    // Emit the join-chat socket from the server.
    socket.emit('join-chat', user);

    //functions
    function sendMessage(data){

        const el = document.createElement('div');
        const span = document.createElement('div');

        const username_date_div = document.createElement('div');
        const username_date_span = document.createElement('div');
        if(user === data.sender){
            span.className = "user-bubble";
            span.innerHTML = data.message;
        }
        else{
            span.className = "recipient-bubble";
            span.innerHTML = data.message;

            username_date_span.innerHTML = `${data.sender}`;
            username_date_span.className = "recipient-details";
            username_date_div.appendChild(username_date_span);
            document.getElementById('messages').appendChild(username_date_div);
        }
        el.appendChild(span);
        document.getElementById('messages').appendChild(el);
    }

    function addNewJoiner(username){
        const list = document.getElementById("list-of-joiners");
        const joiner = document.createElement('li');
        joiner.innerHTML = username;
        joiner.className = 'joiner-item';
        joiner.id = username;
        list.appendChild(joiner);
    }

    function scrollMessagesToBottom(){
        const messages_div = document.getElementById("messages-pane");
        messages_div.scrollTop = messages_div.scrollHeight;
    }

    // Sockets Emitted by the server.
    socket.on('message', data => {
        sendMessage(data);
        scrollMessagesToBottom();
    });

    socket.on('new-user-joined', data => {
        addNewJoiner(data);
    });

    socket.on('join-chat', data => {
        console.log('Users', data.users)
        // set the user name
        const div = document.getElementById('user-name');
        div.innerHTML = user;

        // Retrieve the users joined.
        data.users.forEach(element => {
            addNewJoiner(element);
        });

        // Retrieve the messages.
        data.messages.forEach(element => {
            sendMessage(element);
        });
        
        //set the scrollbar of messagees div
        scrollMessagesToBottom();

    });

    socket.on('remove-user', data=> {
        const div_to_remove = document.getElementById(data);
        div_to_remove.parentNode.removeChild(div_to_remove);
    });

    // Events
    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const textInput = document.querySelector('input');

        // emit the new message to the server.
        socket.emit('message', {message: textInput.value, sender:user});

        // clear the input text after sending the message.
        textInput.value = '';
    })

    window.onbeforeunload = function(event){
        // emit the exit-chat from the server.
        socket.emit('exit-chat', user);
    }
}
else{
    window.location = 'index.html';
}