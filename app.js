var app = new Vue({
  el: '#app',
  data: {
    turn:true,//ture:黒 false:白
    //-1:壁 0:空白 1:黒 2:白
    board: [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0, 0, 0, 1, 2, 0, 0, 0,-1],
            [-1, 0, 0, 0, 2, 1, 0, 0, 0,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]],
    canPutBoard:[],
    gameEnd:false,
    blackStoneNum:2,
    whiteStoneNum:2
  },
  computed:{
    nowTurnColor: function(){
      if(this.turn){
        return 1
      }else{
        return 2
      }
    }
  },
  methods: {
    put: function (_inRowIndex,_inColIndex) {
      this.board[_inRowIndex][_inColIndex] = this.nowTurnColor;
      this.turnStone(_inRowIndex,_inColIndex,-1,0);//上
      this.turnStone(_inRowIndex,_inColIndex,-1,1);//右上
      this.turnStone(_inRowIndex,_inColIndex,0,1);//右
      this.turnStone(_inRowIndex,_inColIndex,1,1);//右下
      this.turnStone(_inRowIndex,_inColIndex,1,0);//下
      this.turnStone(_inRowIndex,_inColIndex,1,-1);//左下
      this.turnStone(_inRowIndex,_inColIndex,0,-1);//左
      this.turnStone(_inRowIndex,_inColIndex,-1,-1);//左上

      this.turn = !this.turn;
      this.createCanPutBoard();

      if(!this.isExistPutPoint()){
        this.turn = !this.turn;
        this.createCanPutBoard();
        if(!this.isExistPutPoint()){
          this.gameEnd = true;
        }
      }
      app.$forceUpdate();
    },
    turnStone: function(y,x,dy,dx){
      y += dy;
      x += dx;

      if(this.board[y][x] == 0 || this.board[y][x] == -1){
        return false;
      }else if(this.board[y][x]!=this.nowTurnColor){
        if(this.turnStone(y,x,dy,dx)){
          this.board[y][x]=this.nowTurnColor;
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }
    },
    canTurnStone: function(y,x,dy,dx,flg){
      y += dy;
      x += dx;
      if(this.board[y][x] == 0 || this.board[y][x] == -1){
        return false;
      }else if(this.board[y][x] != this.nowTurnColor){
        if(this.canTurnStone(y,x,dy,dx,1)){
          return true;
        }else{
          return false;
        }
      }else{
        if(flg != 0){
          return true;
        }else{
          return false;
        }
      }
    },
    canStrike: function(_inRowIndex,_inColIndex){
      return this.canTurnStone(_inRowIndex,_inColIndex,-1,0,0) ||//上
      this.canTurnStone(_inRowIndex,_inColIndex,-1,1,0) ||//右上
      this.canTurnStone(_inRowIndex,_inColIndex,0,1,0) ||//右
      this.canTurnStone(_inRowIndex,_inColIndex,1,1,0) ||//右下
      this.canTurnStone(_inRowIndex,_inColIndex,1,0,0) ||//下
      this.canTurnStone(_inRowIndex,_inColIndex,1,-1,0) ||//左下
      this.canTurnStone(_inRowIndex,_inColIndex,0,-1,0) ||//左
      this.canTurnStone(_inRowIndex,_inColIndex,-1,-1,0) //左上
    },
    createCanPutBoard:function(){
      this.canPutBoard = [];
      this.blackStoneNum = 0;
      this.whiteStoneNum = 0;
      for(var y=0;y<this.board.length;y++){
        var row = [];
        for(var x=0;x<this.board[y].length;x++){
          if(this.board[y][x] == 0){
            row.push(this.canStrike(y,x));
          }else{
            row.push(false);
          }
          if(this.board[y][x] == 1){
            this.blackStoneNum++;
          }else if(this.board[y][x] == 2){
            this.whiteStoneNum++;
          }
        }
        this.canPutBoard.push(row);
      }
    },
    isExistPutPoint:function(){
      for(var y=0;y<this.canPutBoard.length;y++){
        for(var x=0;x<this.canPutBoard[y].length;x++){
          if(this.canPutBoard[y][x]){
            return true
          }
        }
      }
      return false
    },
  },
  mounted: function(){
    this.createCanPutBoard();
    this.gameEnd = false;
  }
})
  