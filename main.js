$(document).ready(initApp);
function initApp(){
    buildGameBoardArray();
    buildGameBoard();
    applyClickHandlers();
    
}
//*******Globals****//
var gameBoardArray;
var destRow;
var destCol;
var blackTurn = true;
var whiteTurn = false;
var currentColor;
var checkAdjacentObj = {
    'up': [-1, 0],
    'upRight': [-1, 1],
    'right': [0, 1],
    'downRight': [1, 1],
    'down': [1, 0],
    'downLeft': [1, -1],
    'left': [0, -1],
    'upLeft': [-1, -1]
}
var oppPieceObj = {
    'b': 'w',
    'w': 'b'
}

var oppositeDirection = {
    'up': 'down',
    'upRight': 'downLeft',
    'right': 'left',
    'downRight': 'upLeft',
    'down': 'up',
    'downLeft': 'upRight',
    'left': 'right',
    'upLeft': 'downRight'
}

var counterObj={};

var directionToCheck = null;

function buildGameBoardArray(){
    gameBoardArray = [
        ['', '', '', '', '', '', '', '' ],
        ['', 'b', '', '', '', '', '', '' ],
        ['', '', 'w', '', '', '', '', '' ],
        ['', '', 'w', 'w', 'b', '', '', '' ],
        ['', '', '', 'w', 'w', '', '', '' ],
        ['', '', '', 'b', 'w', '', '', '' ],
        ['', '', '', '', '', '', '', '' ],
        ['', '', '', '', '', '', '', '' ]
    ]
}
function buildGameBoard(){
    var gameArea = $('.gameboard');
    for(var i = 0; i< gameBoardArray.length; i++){
        for(var j = 0; j< gameBoardArray.length; j++){
            if(gameBoardArray[i][j] === ''){
                var boardDiv = $('<div>').addClass('gameboard-tile').attr({'row': i,'col': j});
                var topDiv = $('<div>').addClass('top-div').attr({'row': i,'col': j});
                boardDiv.append(topDiv);
            } else if(gameBoardArray[i][j] === 'w'){
                var boardDiv = $('<div>').addClass('gameboard-tile').attr({'row': i,'col': j});
                var topDiv = $('<div>').addClass('top-div white-piece').attr({'row': i,'col': j});
                boardDiv.append(topDiv);
            } else {
                var boardDiv = $('<div>').addClass('gameboard-tile').attr({'row': i,'col': j});
                var topDiv = $('<div>').addClass('top-div black-piece').attr({'row': i,'col': j});
                boardDiv.append(topDiv);
            }
            gameArea.append(boardDiv);
        }
    }
}
function applyClickHandlers(){
    $(".gameboard").on('click', '.gameboard-tile', handleBoardClick);
}

function handleBoardClick(){
    if(blackTurn){
        currentColor = 'b';   
    } else{
        currentColor = 'w';
    }
    destRow = parseInt($(event.target).attr('row'));
    destCol = parseInt($(event.target).attr('col'));
    if(gameBoardArray[destRow][destCol] !== ''){
        console.log('Tile is not empty');
        return;
    }
    checkAdjacentTiles();
}
function checkAdjacentTiles(){
    for( key in checkAdjacentObj){
        var adjTileRow = destRow + checkAdjacentObj[key][0];
        var adjTileCol = destCol + checkAdjacentObj[key][1];
        if(adjTileRow > 7 || adjTileRow < 0){
            continue;
        }
        if(adjTileCol > 7 || adjTileCol < 0){
            continue;
        }
        if(gameBoardArray[adjTileRow][adjTileCol] === oppPieceObj[currentColor]){
            directionToCheck = key;
        }
        if(directionToCheck != null){
            console.log(directionToCheck);
            directionCheck(directionToCheck, adjTileRow, adjTileCol);
        }
        directionToCheck = null;    
    }
}

function directionCheck(direction, adjTileRow, adjTileCol){
    var nextAdjTileRow = adjTileRow + checkAdjacentObj[direction][0];
    var nextAdjTileCol = adjTileCol + checkAdjacentObj[direction][1];
    if(nextAdjTileRow > 7 || nextAdjTileRow  < 0){
        return;
    }
    if(nextAdjTileCol > 7 || nextAdjTileCol < 0){
        return;
    }
    if (counterObj[direction] === undefined){
        counterObj[direction] = 1;
    } else {
        counterObj[direction] += 1;
    }
    if(gameBoardArray[nextAdjTileRow][nextAdjTileCol] === oppPieceObj[currentColor]){
        directionCheck(direction, nextAdjTileRow, nextAdjTileCol);
    }
    if(gameBoardArray[nextAdjTileRow][nextAdjTileCol] === currentColor){
        console.log('We can flip ' + counterObj[direction] + ' coins to the ' + direction);
        // call flipCoin();
    }
    return
}

//Places coin on original event.currentTarget
//Flips successive coins in the directions stored in counterObj

function flipCoin(startingPoint, direction, numberofCoins){
    var nextTileRow = destRow;
    var nextTileCol = destCol;
    gameBoardArray[nextTileRow][nextTileCol] = currentColor;
}