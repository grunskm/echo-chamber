
		let user = [];

		let socket;
		let size;
		let cursor;

		socket = io.connect('https://cursor-echo.herokuapp.com/');

		socket.on('connect',()=>{
			socket.emit('new_user',socket.id);
			console.log("sent id to server: "+socket.id);
		});

		socket.on('add_user',(data)=>{
			user.push(new User(data));
			console.log("add user: "+data);
		});

		socket.on('receive_position',(data)=>{
			let update = false;
			for(i=0;i<user.length;i++){
				if(data.id == user[i].id){
					user[i].pos = data.pos;
					update = true;
					break;
				}
			}
			if(update==false){
				user.push(new User(data.id));
				console.log("add user: "+data.id);
			}
		});

		socket.on('remove_user',(data)=>{
			let i = user.indexOf(data);
			user.splice(i,1);
			console.log(user.length);
		});

		function setup(){
			createCanvas(windowWidth,windowHeight);
			background(100);
			noCursor();
			cursor = loadImage("cursor0.png");
			size = width*0.025;
		}

		function draw(){
			clear();
			for(i=0;i<user.length;i++){
				user[i].display();
			}
		}

		function mouseMoved(){
				let xpos = mouseX/width;
				let ypos = mouseY/height;

				let data = {
					x:xpos,
					y:ypos
				}
				socket.emit("update_position",data);
		}

		function User(ID){
			this.id = ID;
			this.pos = {
				x: -1,
				y: -1
			}
			this.x = this.pos.x;
			this.y = this.pos.y;
			
			this.display = function(){
			// uncomment and adjust for mouse easing - makes mouse feel 'skaty'
			//this.x = lerp(this.x,this.pos.x,0.4);
			//this.y = lerp(this.y,this.pos.y,0.4);
				image(cursor,this.pos.x*width,this.pos.y*height,size,size);
			}
		}
