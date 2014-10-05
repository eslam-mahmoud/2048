var size = 4;
var board = new Array();
var movedCells = new Array();
var moveAllowed = true;
var move = 'up';
var score = 0;

function fireKey(el, key){
    var e = $.Event('keydown');
    e.keyCode = key;
    el.trigger(e);
}

function newGame(startingSize){
	$('#gameOver').hide();
	score = 0;
	$('#score span').html(score);
	size = startingSize;
	board = new Array();
	moveAllowed = true;
	
	//create the board
	for(y = 0; y < size; y++){
		board[y] = new Array();
		for(x = 0; x < size; x++){
			board[y][x] = 0;
		}
	}
	
	for(i = 0; i < Math.floor(startingSize/2); i++){
		cell = getRandomPostionAndValue(board, size);
		board[cell['y']][cell['x']] = cell['value'];		
	}

	drow(board);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEmptyCells(){
	emptyCells = [];
	for(y = 0; y < size; y++){
		for(x = 0; x < size; x++){
			if(board[y][x] == 0){
				emptyCells.push({ 'x': x, 'y': y });
			}
		}
	}
	return emptyCells;
}

//get random cell and the random value in it
function getRandomPostionAndValue(board, size){
	emptyCells = getEmptyCells();
	emptyCell = [];

	if(emptyCells.length > 0)
		emptyCell = emptyCells[getRandomInt(0, emptyCells.length-1)];
	else
		return 0;

	value = getRandomInt(1,2)*2;
	return {'x':emptyCell['x'], 'y':emptyCell['y'], 'value':value};
}

//get the new x and y location based on the move and the current x and y
function getnewXY(x, y, move){
	newX = 0;
	newY = 0;

	switch(move){
		case 'up':
			newX = x;
			newY = y-1;
			break;
		case 'down':
			newX = x;
			newY = y+1;
			break;
		case 'right':
			newX = x+1;
			newY = y;
			break;
		case 'left':
			newX = x-1;
			newY = y;
			break;
	}

	return {'x':newX, 'y':newY};
}

//TODO: check if the new x and y was moved in the prevose step dont add on it
//move cell x*y to the new generated x*y
function moveIt(x, y, size, move, board){
	newXY = getnewXY(x, y, move);
	//we stop the move because the cell did not move in the first place or have be added to the new cell means we have no space to the new cell
	newXY['stopMoves'] = false;
	newX = newXY['x'];
	newY = newXY['y'];
	
	if(newX < 0 || newX >= size) {
		return 0;
	}
	if(newY < 0 || newY >= size) {
		return 0;
	}

	//if the new x&y value is 0 update it to cary the old x&y value and set the old x&y to 0
	if(board[newY][newX] == 0){
		board[newY][newX] = board[y][x];   
		board[y][x] = 0;
		return newXY;
	}
	//if the new x&y value is = to the old x&y value set it with value*2 and set the old x&y to 0
	else if(board[newY][newX] == board[y][x]){
		board[newY][newX] *= 2;   
	
		score += board[newY][newX];
		$('#score span').html(score);
			
		board[y][x] = 0; 
		newXY['stopMoves'] = true;  
		return newXY;
	}
	//if have diffrant numbers then cell should not be moved
	else{
		return {'x':x, 'y':y, 'stopMoves':true};
	}
}

function moveUp(board, size){
	somethingMoved = false;
	for(x = 0; x < size; x++){//for each colomn
		for(y = 1; y < size; y++){//for each row starting form the second one as the first will not be moved in move up action
			x2 = x;
			y2 = false;
			for(i = 0; i < y; i++){//move the cell i times (row number - 1)
				if(!y2) {
					y2 = y;
				}

				new2 = moveIt(x2, y2, size, 'up', board);//move x&y, return the new x&y or 0 if out of the size of the array

				if(new2 !=0 && new2['y']!=y2 && board[new2['y']][new2['x']] != 0){
					somethingMoved = true;
				}

				if(new2 == 0){
					//out of the size of the board like moving the first row up !
					break;
				}
				else if(new2['stopMoves']){
					break;
				}
				else{
					//cell moved update the x&y with the new values to be send to moveIt() function
					y2 = new2['y'];
					x2 = new2['x'];
				}
			}
		}
	}

	return somethingMoved;
}

function moveDown(board, size){
	somethingMoved = false;

	for(x = 0; x < size; x++){
		for(y = size-2; y > -1; y--){
			x2 = false;
			y2 = false;
			for(i = 1; i < size; i++){
				if(!y2) y2 = y;
				x2 = x;
				new2 = moveIt(x2, y2, size, 'down', board);
				
				if(new2 !=0 && new2['y']!=y2 && board[new2['y']][new2['x']] != 0){
					somethingMoved = true;
				}

				if(new2 == 0){
					//out of the size of the board like moving the first row up !
					break;
				}
				else if(new2['stopMoves']){
					break;
				}
				else{
					//cell moved update the x&y with the new values to be send to moveIt() function
					y2 = new2['y'];
					x2 = new2['x'];
				}
			}
		}
	}

	return somethingMoved;
}

function moveRight(board, size){
	somethingMoved = false;
	
	for(y = 0; y < size; y++){
		for(x = size-2; x > -1; x--){
			x2 = false;
			y2 = false;
			for(i = 1; i < size; i++){
				if(!x2) x2 = x;
				y2 = y;
				new2 = moveIt(x2, y2, size, 'right', board);
				
				if(new2 !=0 && new2['x']!=x2 && board[new2['y']][new2['x']] != 0){
					somethingMoved = true;
				}

				if(new2 == 0){
					//out of the size of the board like moving the first row up !
					break;
				}
				else if(new2['stopMoves']){
					break;
				}
				else{
					//cell moved update the x&y with the new values to be send to moveIt() function
					y2 = new2['y'];
					x2 = new2['x'];
				}
			}
		}
	}

	return somethingMoved;
}

function moveLeft(board, size){
	somethingMoved = false;
	
	for(y = 0; y < size; y++){
		for(x = 1; x < size; x++){
			x2 = false;
			y2 = false;
			for(i = 1; i < size; i++){
				if(!x2) x2 = x;
				y2 = y;
				new2 = moveIt(x2, y2, size, 'left', board);
				
				if(new2 !=0 && new2['x']!=x2 && board[new2['y']][new2['x']] != 0){
					somethingMoved = true;
				}

				if(new2 == 0){
					//out of the size of the board like moving the first row up !
					break;
				}
				else if(new2['stopMoves']){
					break;
				}
				else{
					//cell moved update the x&y with the new values to be send to moveIt() function
					y2 = new2['y'];
					x2 = new2['x'];
				}
			}
		}
	}

	return somethingMoved;
}

function boardClosed(board){
	var closed = true;
	for( y = 0 ; y < board.length ; y++ ){
		if(closed == true){
			for( x = 0 ; x < board.length ; x++ ){
				newXY = getnewXY(x, y, 'up');
				if(typeof board[newXY['y']] != 'undefined' && typeof board[newXY['y']][newXY['x']] != 'undefined' && board[y][x] == board[newXY['y']][newXY['x']]){
					closed = false;
					break;
				}
				
				newXY = getnewXY(x, y, 'down');
				if(typeof board[newXY['y']] != 'undefined' && typeof board[newXY['y']][newXY['x']] != 'undefined' && board[y][x] == board[newXY['y']][newXY['x']]){
					closed = false;
					break;
				}
			
				newXY = getnewXY(x, y, 'left');
				if(typeof board[newXY['y']] != 'undefined' && typeof board[newXY['y']][newXY['x']] != 'undefined' && board[y][x] == board[newXY['y']][newXY['x']]){
					closed = false;
					break;
				}
				
				newXY = getnewXY(x, y, 'right');
				if(typeof board[newXY['y']] != 'undefined' && typeof board[newXY['y']][newXY['x']] != 'undefined' && board[y][x] == board[newXY['y']][newXY['x']]){
					closed = false;
					break;
				}
			}
		}
	}
	
	return closed;
}

function action(e) {
	if(moveAllowed)
		moveAllowed = false;
	else{//move in action
		return;
	}

	ignoreKey = false;
	somethingMoved = false;

	switch(e.keyCode){
		case 38://up
			move = 'up';
			somethingMoved = moveUp(board, size);
			e.preventDefault();
			break;
		case 40://down
			move = 'down';
			somethingMoved = moveDown(board, size);
			e.preventDefault();
			break;
		case 39://right
			move = 'right';
			somethingMoved = moveRight(board, size);
			e.preventDefault();
			break;
		case 37://left
			move = 'left';
			somethingMoved = moveLeft(board, size);
			e.preventDefault();
			break;

		default:
			ignoreKey = true;
			break;
	}

	if(!ignoreKey){
		randomCell = getRandomPostionAndValue(board, size);
		//only for the first random cell check if no empty cell check of the board is closed
		if(randomCell == 0){
			if(boardClosed(board)){
				$('#gameOver').show();
				gameStarted = false;
				ga('send', 'pageview', '/2048?newGame');
				alert('game over.');
				return;
			}
		}
		else if(somethingMoved){
			board[randomCell['y']][randomCell['x']] = randomCell['value'];

			//we genirate random cells = to (starting size/4)-1 
			//the -1 because the first one that we check if the board is closed with it
			for(i = 0; i < Math.floor(size/4)-1; i++){
				randomCell = getRandomPostionAndValue(board, size);
				if(randomCell != 0){
					board[randomCell['y']][randomCell['x']] = randomCell['value'];		
				}
			}
		}
	}

	//move ended and can do second move
	moveAllowed = true;

	drow(board);
}

function drow(board){
	$('#content').html('');
	for(temp1 = 0; temp1 < size; temp1++){
		for(temp2 = 0; temp2 < size; temp2++){
			$('#content').append('<div class="cell c_'+board[temp1][temp2]+'">' + board[temp1][temp2] + '</div>');
		}
		$('#content').append('<br>');
	}
	$('#content').append('<br>');
}