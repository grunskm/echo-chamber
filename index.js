


var express = require('express');
var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('App listening at http://' + host + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

io.sockets.on('connection',(socket)=>{

	socket.on('new_user', (data)=>{
		io.sockets.emit('add_user',data);
		console.log("new user id:"+data+". socket.id = "+socket.id);
	});

	socket.on('update_position',(data)=>{
		let data_out = {
			id:socket.id,
			pos:data
		}
		io.sockets.emit('receive_position',data_out);
	});

	socket.on('disconnect', ()=>{
		console.log("user "+socket.id+" disconnected");
		io.sockets.emit('remove_user',socket.id);
	});
});
