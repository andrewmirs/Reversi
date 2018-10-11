$(document).ready(initApp);

function initApp(){
    buildGameBoardArray();
    buildGameBoard();
    applyClickHandlers();
    $('.pointsboard-black').addClass('chip-hop');
    
}

//*******Globals****//
var gameBoardArray;
var destRow;
var destCol;
var timer;
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
var counterObj = {};
var turnTrackerObj = {}
var directionToCheck = null;
var hasTimerStarted = false;

// Score Board
function keepScore(){
    var tallyWhite = null;
    var tallyBlack = null;
    for( var i=0;i<gameBoardArray.length; i++){
        for(var j=0;j<gameBoardArray[i].length;j++){
            if (gameBoardArray[i][j] === 'b'){
                tallyBlack++;
            } else if (gameBoardArray[i][j] === 'w'){
                tallyWhite++;
            }
        }
    }
    $('.pointsW').text(tallyWhite);
    $('.pointsB').text(tallyBlack);
}

// Game Board Functions
function buildGameBoardArray(){
    gameBoardArray = [
        ['', '', '', '', '', '', '', '' ],
        ['', '', '', '', '', '', '', '' ],
        ['', '', '', '', '', '', '', '' ],
        ['', '', '', 'w', 'b', '', '', '' ],
        ['', '', '', 'b', 'w', '', '', '' ],
        ['', '', '', '', '', '', '', '' ],
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
    keepScore();
}
function applyClickHandlers(){
    $(".gameboard").on('click', '.gameboard-tile', handleBoardClick);
    $('.option1').on('click', hideModal);
    $(".reset").on('click', resetBoard);
}

function resetBoard(){
    blackTurn = true;
    whiteTurn = false;
    counterObj = {};
    directionToCheck = null;
    hasTimerStarted = false;
    turnTrackerObj = {};
    $('.gameboard').empty();
    buildGameBoardArray();
    buildGameBoard();
    keepScore();
    stopTimer();
    $('.pointsboard-white').removeClass('chip-hop');
    $('.pointsboard-black').addClass('chip-hop');

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
        return;
    }
    checkAdjacentTiles();
    if(turnTrackerObj[currentColor] !== undefined){
        switchTurns();  
    }  
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
        if(directionToCheck){
            directionCheck(directionToCheck, adjTileRow, adjTileCol);
        }
        directionToCheck = null;    
    }
    
}
function directionCheck(direction, adjTileRow, adjTileCol){
    var nextTileRow = adjTileRow + checkAdjacentObj[direction][0];
    var nextTileCol = adjTileCol + checkAdjacentObj[direction][1];
    if(nextTileRow > 7 || nextTileRow < 0){
        return;
    }
    if(nextTileCol > 7 || nextTileCol < 0){
        console.log('off board')
        return;
    }
    if(gameBoardArray[nextTileRow][nextTileCol] === ''){
        return;
    }
    if(gameBoardArray[nextTileRow][nextTileCol] === currentColor){
        if(counterObj[direction] === undefined){
            counterObj[direction] = 1;
        } else {
            counterObj[direction] += 1;
        }
        changePieces(direction, nextTileRow, nextTileCol);
        return;
    }
    if(gameBoardArray[nextTileRow][nextTileCol] === oppPieceObj[currentColor]){
        if(counterObj[direction] === undefined){
            counterObj[direction] = 1;
        } else {
            counterObj[direction] += 1;
        }
        directionCheck(direction, nextTileRow, nextTileCol);
        return;
    }
}

function changePieces(direction){
    if(!hasTimerStarted){
        startTimer();
        hasTimerStarted = true;
    }
    if(turnTrackerObj[currentColor] === undefined){
        turnTrackerObj[currentColor] = 1;
    } else{
        turnTrackerObj[currentColor] += 1;
    }
    var changedRow = destRow;
    var changedCol = destCol;
    gameBoardArray[destRow][destCol] = currentColor;
    for(var i = 0; i < counterObj[direction]; i++){
        changedRow = changedRow + checkAdjacentObj[direction][0];
        changedCol = changedCol + checkAdjacentObj[direction][1];
        gameBoardArray[changedRow][changedCol] = currentColor;
        
    }
    $('.gameboard').empty();
    buildGameBoard();

}
function switchTurns(){
    if(blackTurn){
        $('.pointsboard-black').removeClass('chip-hop');
        $('.pointsboard-white').addClass('chip-hop');
        blackTurn = false;
        whiteTurn = true;
    } else {
        $('.pointsboard-white').removeClass('chip-hop');
        $('.pointsboard-black').addClass('chip-hop');
        blackTurn = true;
        whiteTurn = false;
    }
    turnTrackerObj = {};
    counterObj = {};
}

function startTimer(){
    var counter = 0;
    var minutes = 0;
    timer = setInterval(function(){
        if(counter < 59){
        counter++;
        }else{
            minutes++;
            counter = 0;    
        }
    }, 1000); 
}

function stopTimer(){
    clearInterval(timer);
}

function hideModal(){
    $('.intro-modal').addClass('hidden');
    $('.modal-background').addClass('hidden2');
}
function showModal(){
    $('.intro-modal').removeClass('hidden');
    $('.modal-background').removeClass('hidden2');
    $('.intro-modal').addClass('show');
    $('.modal-background').addClass('show2');
}
