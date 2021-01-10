
let user = [];

let sketch = function(p) {

	let socket;

	let mouse = [];
	let cursor_size;
	let cursorImg = 0;


	p.setup = function(){
		p.createCanvas(p.windowWidth,p.windowHeight);
		p.noCursor();
		cursor_size = p.width*0.025;

		for(i=0;i<4;i++){
			mouse.push(p.loadImage("cursor"+i+".png"));
		}

		socket = io.connect('https://franc-test.herokuapp.com/');

		socket.on('connect',()=>{
			user.push(new User(socket.id,-1,-1,cursorImg));
		});

		socket.on('disconnect',()=>{
			socket.emit('leave',socket.id);
		});

		socket.on('position', function(data){

			let position_update=false;

			for(i=0;i<user.length;i++){
				if(data.id==user[i].id){
					user[i].pos = data.pos;
					position_update=true;
				//	print("updated");
					break;
				}
			}
			if(position_update==false){
				user.push(new User(data.id, -1, -1, data.c));
				p.print("new user: " + data.id);
			}
		});

		socket.on('remove',()=>{
			for(i=0;i<user.length;i++){
				if(data == user[i].id){
					user.splice(i,1);
					break;
				}
			}
		});
	}

	p.draw = function(){
		//background(0);
		p.clear();
		for(i=0;i<user.length;i++){
			user[i].display();
		}
	}

	p.mouseMoved = function(){
		if(user.length>0){
			let xpos = p.mouseX/p.width;
			let ypos = p.mouseY/p.height;
			let data = {
				id:user[0].id,
				pos:{x:xpos.toFixed(4),y:ypos.toFixed(4)},
				c:cursorImg
			};
		//	print(data);
			socket.emit('update', data);
		}
	}

	function User(ID,X,Y,C){
		this.id = ID;
		this.pos = {x:X,y:Y};
		this.cursor = C;

		this.display = function(){
			p.image(mouse[this.cursor],this.pos.x*p.width,this.pos.y*p.height,cursor_size,cursor_size);
		}
	}
}

p51 = new p5(sketch);
