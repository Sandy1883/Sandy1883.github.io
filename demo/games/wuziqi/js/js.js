var chess = document.getElementById('chess');
var context = chess.getContext('2d');
context.strokeStyle="#BFBFBF";
var me = true;
//是否结束
var over = false;

//赢法数组
var wins = [];
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j] = []
	}
}
//赢法总数
var count = 0;

//赢法统计
var mywin = [];
var cwin = [];

//落子
var chessArr = [];
for(var i=0;i<15;i++){
	chessArr[i]=[];
	for(var j=0;j<15;j++){
		chessArr[i][j] = 0
	}
}

//所有横着的赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//所有竖着的赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//所有斜的赢法
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//所有反斜的赢法
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}
//根据所有赢法，对赢法统计进行初始化
for(var i=0;i<count;i++){
	mywin[i]=0;
	cwin[i]=0;
}

var logo =  new Image();
logo.src = 'images/bg.jpg';
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);
	drawbg();
}
function drawbg(){
	for(var i=0;i<15;i++){
		context.moveTo(15+i*30,15);
		context.lineTo(15+i*30,435);
		context.stroke()
		context.moveTo(15,15+i*30);
		context.lineTo(435,15+i*30);
		context.stroke()
	}
}

var oneStep = function(i,j,me){
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	if(me){
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
	}
	context.fillStyle=gradient;
	context.fill()
}
chess.onclick = function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x= e.offsetX;
	var y= e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessArr[i][j]==0){
		oneStep(i,j,me)
		chessArr[i][j]=1;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				mywin[k]++;
				cwin[k]==6;
				if(mywin[k]==5){
					alert('小伙子，你赢了');
					over=true;
				}
			}
		}
		if(!over){
			me = !me;
			cai();
		}
	}
}
var cai = function(){
	var ms = []; //我的分数
	var cs = []; //计算机分数
	var max=0,u=0,v=0; //最高分数点

	for(var i=0;i<15;i++){ //初始化所有的点的分数
		ms[i]=[];
		cs[i]=[];
		for(var j=0;j<15;j++){
			ms[i][j]=0;
			cs[i][j]=0;
		}
	}
	for(var i=0;i<15;i++){ //所有的落子点
		for(var j=0;j<15;j++){
			if(chessArr[i][j]==0){ //如果是空
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(mywin[k]==1){
							ms[i][j]+=200;
						}else if(mywin[k]==2){
							ms[i][j]+=600;
						}else if(mywin[k]==3){
							ms[i][j]+=5000;
						}else if(mywin[k]==4){
							ms[i][j]+=20000;
						}
						if(cwin[k]==1){
							cs[i][j]+=200;
						}else if(cwin[k]==2){
							cs[i][j]+=600;
						}else if(cwin[k]==3){
							cs[i][j]+=7000;
						}else if(cwin[k]==4){
							cs[i][j]+=50000;
						}
					}
				}
				if(ms[i][j]>max){
						max = ms[i][j];
						u = i;
						v = j;
					}else if(ms[i][j]==max){
						max = ms[i][j];
						u = i;
						v = j;
					}
					if(cs[i][j]>max){
						max = cs[i][j];
						u = i;
						v = j;
					}else if(cs[i][j]==max){
						max = ms[i][j];
						u = i;
						v = j;
					}
			}
		}
	}
	oneStep(u,v,false);
	chessArr[u][v]=2;
	for(var k=0;k<count;k++){
			if(wins[u][v][k]){
				cwin[k]++;
				mywin[k]==6;
				if(cwin[k]==5){
					alert('电脑赢了');
					over=true;
				}
			}
		}
		if(!over){
			me = !me;
		}
}

