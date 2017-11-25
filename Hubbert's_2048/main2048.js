
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

document.addEventListener('touchmove',function ( event ) {
    //阻挡动作发生的时候默认的效果
    //按下可能滚动条也会跟着移动
    event.preventDefault();
});

document.addEventListener('touchstart',function( event ){
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});

document.addEventListener('touchend',function( event ){
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var deltaX = endX - startX ;
    var deltaY = endY - startY ;

    if( Math.abs(deltaX) < 0.2*documentWidth && Math.abs(deltaY) < 0.2*documentWidth)
        return;

    //x
    if( Math.abs(deltaX) >= Math.abs(deltaY) ){
       //move right
       if(deltaX > 0){
            if(moveRight()){
                setTimeout('generateOneNumber()',210);
                setTimeout('isGameOver()',300);
            }
       }
       //move right
        else {
           if(moveLeft()){
               setTimeout('generateOneNumber()',210);
               setTimeout('isGameOver()',300);
           }
       }
    }
    //y
    else {
        //move up
        if(deltaY < 0){
            if(moveUp()){
                setTimeout('generateOneNumber()',210);
                setTimeout('isGameOver()',300);
            }
        }
        //move down
        else {
            if(moveDown()){
                setTimeout('generateOneNumber()',210);
                setTimeout('isGameOver()',300);
            }
        }
    }

});


function prepareForMobile(){

    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
    //分数为0
    updateScore(0);
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    //1.初始化棋盘格
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }

    //创建二维数组
    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
}

function updateBoardView(){
    //如果有number-cell的元素，应该全部删除
    $(".number-cell").remove();

    //动态添加number-cell
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            //当board[][]=0 不显示出来
            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

            hasConflicted[i][j] = false;
        }

    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.4*cellSideLength+'px');

}

function generateOneNumber() {

    //先判断有没有空格可以生成数字
    if( noSpace(board) ){
        return false;
    }

    //1,随机一个位置
    var randX = parseInt(Math.floor(Math.random()*4));
    var randY = parseInt(Math.floor(Math.random()*4));
    var count = 0 ;

    //让计算机随机猜50次随机位置没有值的地方
    while(count < 50){
        if( board[randX][randY] == 0){
                break;
        } else {
            randX = parseInt(Math.floor(Math.random()*4));
            randY = parseInt(Math.floor(Math.random()*4));
            count++;
        }
    }

    //如果没有直接找到空位置直接赋值
    if(count == 50){
        for( var i = 0 ; i < 4 ; i++){
            for( var j = 0 ; j < 4 ; j++){
                if(board[i][j] == 0){
                    randX = i ;
                    randY = j;
                }
            }
        }
    }

    //2.随机一个数字
    var randNumber = Math.random() <= 0.5 ? 2 : 4 ;

    //3.在随机位置显示随机数字
    board[randX][randY]= randNumber;

    //显示数字的动态效果
    showNumberWithAnimation(randX,randY,randNumber);

    return true;
}

$(document).keydown( function ( event ){
    switch ( event.keyCode ) {
        case 37: //left
            event.preventDefault();
            //判断能否 左移
            if ( moveLeft() ){
                //每次生成一个数字还能判断游戏是否结束了
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38: //up
            event.preventDefault();
            if ( moveUp() ){
                //每次生成一个数字还能判断游戏是否结束了
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if ( moveRight() ){
                //每次生成一个数字还能判断游戏是否结束了
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if ( moveDown() ){
                //每次生成一个数字还能判断游戏是否结束了
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        default:
            break;

    }
});

function isGameOver() {
    if( noSpace( board ) && noMove( board )){
        gameover();
    }
}

function gameover() {
    alert("gameOver!")
    // showGameOver();
}



function moveLeft(){

    if( !canMoveLeft( board )){
        return false;
    }

    //moveLeft
    for( var i = 0 ; i < 4 ; i++ ){
        for( var j = 1 ; j < 4 ; j++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < j ; k++ ){
                    //在第i行的[k,j]的board数组中看是否有障碍物
                    if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){

    if( !canMoveRight( board )){
        return false;
    }

    //moveRight
    for( var i = 0 ; i < 4 ; i++ ){
        for( var j = 2 ; j >= 0 ; j-- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k >j ; k-- ){
                    //在第i行的[k,j]的board数组中看是否有障碍物
                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board )){
        return false;
    }

    //moveUp
    for( var j = 0 ; j < 4 ; j++ ){
        for( var i = 1 ; i < 4 ; i++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k++ ){
                    //在第j列的[k,i]行的board数组中看是否有障碍物
                    if( board[k][j] == 0 && noBlockVertic( j , k , i , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[k][j] == board[i][j] && noBlockVertic( j , k , i , board ) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){

    if( !canMoveDown( board )){
        return false;
    }

    //moveDown
    for( var j = 0 ; j < 4 ; j++ ){
        for( var i = 2 ; i >= 0 ; i-- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k-- ){
                    //在第i行的[k,j]的board数组中看是否有障碍物
                    if( board[k][j] == 0 && noBlockVertic( j , i , k , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[k][j] == board[i][j] && noBlockVertic( j , i , k , board ) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}
