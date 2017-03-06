  var game = function(id,params){
    var _ = this,
    canvas = document.getElementById(id),
    context = canvas.getContext('2d'),
    params = params || {},
    setting = {
      width:0, // 画布宽度
      height:0, // 画布高度
      itemW:20, // 小块宽度
      itemWLength:18,
      itemHLength:28,
      over:false, // 游戏结束
      itemArr:[], // 所有点的位置
      snakeArr:[], //蛇的坐标组
      food:[], // 食物坐标
      score:0, // 分数
      go:'',
      goPosition:1, // 当前前进方向  1 2 3 4  左，上，右，下
      goTime:''
    }
    var _extend = function(target,setting,params){ // 混合
      for(var i in setting){
        target[i] = params[i] || setting[i]
      }
      return target
    }
    _extend(_,setting,params)
    canvas.width = _.width = _.itemW*_.itemWLength+30;
    canvas.height = _.height = _.itemW*_.itemHLength+30;
    var _random = function(Min,Max){ // 计算一个随机位置
      var Range = Max - Min;
      var Rand = Math.random();
      if(Math.round(Rand * Range)==0){
        return Min + 1;
      }else if(Math.round(Rand * Max)==Max)
      {
        return Max - 1;
      }else{
        var num = Min + Math.round(Rand * Range) - 1;
        return num;
      }
    }
    _._drawBg = function(){ // 绘制背景
      context.strokeStyle="#666";
      context.translate(0.5,0.5); 
      context.lineWidth = 1;
      for(var i=0;i<_.itemWLength+1;i++){
        context.moveTo(15+i*_.itemW,15);
        context.lineTo(15+i*_.itemW,_.height-15);
        context.stroke()
      }
      for(var i=0;i<_.itemHLength+1;i++){
        context.moveTo(15,15+i*_.itemW);
        context.lineTo(_.width-15,15+i*_.itemW);
        context.stroke()
      }
    }
    _._drawSnake = function(){ // 画蛇

      if(_.snakeArr.length<1){
        function creatSnake(){
          var x = _random(1,_.itemWLength),
          y = _random(1,_.itemWLength);
          if(x == _.food[0] || y == _.food[1]){
            creatSnake()
          }else{
            _.snakeArr.push([x,y])
          }
        }
        creatSnake()
      }
      for(var i=0;i<_.snakeArr.length;i++){
        context.fillStyle = "green";
        //绘制图形
        context.fillRect(_.snakeArr[i][0]*_.itemW+15+1,_.snakeArr[i][1]*_.itemW+1+15,_.itemW-2,_.itemW-2);
      }
    }
    _._delDrawSnake = function(){ // 清除蛇尾巴
      for(var i=0;i<_.snakeArr.length;i++){
        context.clearRect(_.snakeArr[i][0]*_.itemW+15+1,_.snakeArr[i][1]*_.itemW+0+15,_.itemW-1,_.itemW-1);
      }
    }
    _._food = function(){ // 画食物
      var x = _random(1,_.itemWLength),
      y = _random(1,_.itemWLength);
      context.fillStyle = "red";  
      //绘制图形  
      context.fillRect(x*_.itemW+15+1,y*_.itemW+15+1,_.itemW-2,_.itemW-2);
      _.food = [x,y]
    }
    _._addShake = function(position){
      if(_.food[0]==position[0] && _.food[1]==position[1]){ // 是食物，清除，添加长度
        context.clearRect(_.food[0]*_.itemW+15+1,_.food[1]*_.itemW+0+15,_.itemW-1,_.itemW-1);
        _.score++
        _._food()
      }else{
        _.snakeArr.pop()
      }
      _.snakeArr.unshift(position)
    }
    _._boom = function(keycode){ // 碰撞
      var newPosition = []
      var result = 0  
                // {state:1,data:[]} 自身反方向  
                // {state:2,data:[]}  死亡  
                // {state:3,data:[x,y]} 前进
      if(keycode==37){
        _.goPosition = 1
        if(_.snakeArr[0][0]-1 == -1){
          result = {state:2}
        }else{
          result = {state:3}
          newPosition= [_.snakeArr[0][0]-1,_.snakeArr[0][1]]
        }
      }
      if(keycode == 38) {
        _.goPosition = 2
        if(_.snakeArr[0][1]-1 == -1){
          result = {state:2}
        }else{
          result = {state:3}
          newPosition = [_.snakeArr[0][0],_.snakeArr[0][1]-1]
        }
      }
      if(keycode == 39) {
        _.goPosition = 3
        if(_.snakeArr[0][0]+1 > _.itemWLength-1){
          result = {state:2}
        }else{
          result = {state:3}
          newPosition = [_.snakeArr[0][0]+1,_.snakeArr[0][1]]
        }
      }
      if(keycode == 40) {
        _.goPosition = 4
        if(_.snakeArr[0][1]+1 > _.itemHLength-1){
          result = {state:2}
        }else{
          result = {state:3}
          newPosition = [_.snakeArr[0][0],_.snakeArr[0][1]+1]
        }
      }
      if(result.state==3){ // 前进或者死亡
        var isdie = false
        for(var i=0;i<_.snakeArr.length;i++){
          if(_.snakeArr[i][0]==newPosition[0] && _.snakeArr[i][1]==newPosition[1]){
            isdie = true
          }
        }
        if(isdie){// 撞到自己了，宣判死亡
          result = {state:2}
        }else if(_.snakeArr[1] && _.snakeArr[1][0]==newPosition[0] && _.snakeArr[1][1]==newPosition[1]){ // 相反方向按键，不做回应
          return false
        }else{
          result = {state:3,data:newPosition}
        }
      }
      return result
    }
    _._attachEvents = function(e){
      clearInterval(_.goTime)
      var keycode = e.keyCode,
          result = _._boom(keycode) 
      if(result.state==2){
        alert('游戏结束')
        clearInterval(_.goTime)
      }else if(result.state==3){
        _._delDrawSnake()
        _._addShake(result.data)
        _.goTime = setInterval(_.go,1000)
      }
      _._showScore()
    }
    _._showScore = function(){// 显示分数
      document.title = '分数:'+_.score
    }
    _._start = function(){
      _._drawBg() // 初始化背景
      _._food() // 随机食物
      setInterval(function(){ // 按帧画蛇
        _._drawSnake()
      },20)
      _.go = function(){
        if(_.goPosition==1) _._attachEvents({keyCode:37}) // 模拟事件，动起来
        if(_.goPosition==2) _._attachEvents({keyCode:38}) // 模拟事件，动起来
        if(_.goPosition==3) _._attachEvents({keyCode:39}) // 模拟事件，动起来
        if(_.goPosition==4) _._attachEvents({keyCode:40}) // 模拟事件，动起来
        _._showScore()
      }
      _.goTime = setInterval(_.go,1000)
      document.onkeydown=function(event){ // 监听按键
        var e = event || window.event || arguments.callee.caller.arguments[0];
        _._attachEvents(e)
      }; 
    }
    _.init = function(){
      _._start()
    }
  }