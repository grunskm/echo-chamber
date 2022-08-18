
		let user = [];

		let socket;
		let size;
		let cursor;

		let ymargin = 0;
		let xmargin = 0;
		let vid_wd = 100;
		let vid_ht = 100;

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
					user[i].count = 0;
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
		});

		function setup(){
			createCanvas(windowWidth,windowHeight);
			background(100);
			noCursor();
			cursor = loadImage("cursor0.png");
			resize();
		}

		function draw(){
			clear();
			for(i=0;i<user.length;i++){
				user[i].display();
			}

			//for testing purposes 
			//fill(255,50);
			// strokeWeight(5);
			// stroke(255,0,0);
			// rect(xmargin,ymargin,vid_wd,vid_ht);
		}

		function mouseMoved(){

				let xpos = (mouseX-xmargin)/vid_wd;
				let ypos = (mouseY-ymargin)/vid_ht;

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
			//needed for mouse lerping
			// this.x = this.pos.x;
			// this.y = this.pos.y;

			this.display = function(){
			// uncomment and adjust for mouse easing - makes mouse feel 'skaty'
			//this.x = lerp(this.x,this.pos.x,0.4);
			//this.y = lerp(this.y,this.pos.y,0.4);
				if(this.count<18000){// temporarily removes inactive users
					image(cursor,this.pos.x*vid_wd+xmargin,this.pos.y*vid_ht+ymargin,size,size);
				}
			}
		}

function resize(){
		print('resize window');
		resizeCanvas(windowWidth, windowHeight);
		if(height/width>=0.5625){
			vid_wd = width;
			vid_ht = vid_wd*0.5625;
			xmargin = 0;
			ymargin = (height-vid_ht)/2;

		}else{
			vid_ht = height;
			vid_wd = vid_ht*1.7777;
			ymargin = 0;
			xmargin = (width-vid_wd)/2;
		}
		size = vid_wd*0.03;
}

window.onresize = ()=>{
	resize();
}
