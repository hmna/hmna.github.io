
var time = 0;

function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    // IMPLEMENTED: Get rows and columns
    
    setDifficulty();
    var difficulty = document.getElementById("difficulty");
    var rows = difficulty.rows;
    var columns = difficulty.columns;

    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
        }
    }
    
    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";
}

function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("normal_tile");
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks
    tile.addEventListener("mousedown", handleTileDown ); // All Clicks

    // IMPLEMENTED: Add tile properties such as coordinates, flags, revealed, numbers so we can access it when clicked
    tile.coordinates = {x,y};
    tile.flagged = 0;
    tile.revealed = 0;
    tile.number = 0; //-1 is bomb, 0->8 # of bombs surronding, 0 is default

    return tile;
}

function startGame() {
    buildGrid();
    
    if (typeof myTimer !== 'undefined') endTimer();
    document.getElementById("timer").innerHTML = "";

    //setting smiley back to normal after game
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_lose");
    smiley.classList.remove("face_win");

    //set message back to nothing
    var message = document.getElementById("message");
    message.innerHTML = "";
    message.className = "";

    //make grid clickable again
    var grid = document.getElementById("minefield");
    grid.classList.remove("disable_clicks");

}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

// IMPLEMENTED: Traverse through the whole board reveal all bombs when you click on a mine 
function revealMines(winlose){
    var grid = document.getElementById("minefield");

    for (var i = 0; i < grid.childNodes.length; i++){
        if (isAMine(grid.childNodes[i].coordinates, grid.mines)){
            if(winlose === "lose"){
                //if not flagged, show it as mine
                if (grid.childNodes[i].flagged == 0){
                    grid.childNodes[i].classList.add("mine");
                    grid.childNodes[i].revealed = 1;
                }
            }   
            else if(winlose === "win"){
                //if not flagged, flag it
                if (grid.childNodes[i].flagged == 0){
                    grid.childNodes[i].flagged = 1;
                    grid.childNodes[i].classList.add("flag");
                }
            }             
        }
        else{ //not a mine but if it's flagged, show it's wrong
            if(winlose === "lose"){
                if (grid.childNodes[i].flagged == 1){
                grid.childNodes[i].classList.add("mine_marked");
                grid.childNodes[i].revealed = 1;
                }
            }
            
        }
    }
}

// IMPLEMENTED: spits out the neighbouring tiles' indexes for the coordinates given
function findMyNeighbours(myxy){
    var neighbours = [];
    var grid = document.getElementById("minefield");

    for (var i = 0; i < grid.childNodes.length; i++){
        if(grid.childNodes[i].coordinates.x == myxy.x - 1){
            if((grid.childNodes[i].coordinates.y == myxy.y - 1) || 
                (grid.childNodes[i].coordinates.y == myxy.y) ||
                (grid.childNodes[i].coordinates.y == myxy.y + 1)){
                neighbours.push(i);
            }
        }
        else if(grid.childNodes[i].coordinates.x == myxy.x){
            if((grid.childNodes[i].coordinates.y == myxy.y - 1) ||
                (grid.childNodes[i].coordinates.y == myxy.y + 1)){
                neighbours.push(i);
            }
        }
        else if(grid.childNodes[i].coordinates.x == myxy.x + 1){
            if((grid.childNodes[i].coordinates.y == myxy.y - 1) || 
                (grid.childNodes[i].coordinates.y == myxy.y) ||
                (grid.childNodes[i].coordinates.y == myxy.y + 1)){
                neighbours.push(i);
            }
        }
        
    }
    return neighbours;
}

//IMPLEMENTED: reveal my neighbouring tiles
function revealMyNeighbours(tile){
    var grid = document.getElementById("minefield");
    var neighbours = findMyNeighbours(tile.coordinates);
    for (var a = 0; a < neighbours.length; a++){
        revealMyTile(grid.childNodes[neighbours[a]]);  
    }
}

//IMPLEMENTED: series of events that take place when you win
function gameWin(){

    //smiley shows happy
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_win");

    //show flags if we haven't and set flagcount
    revealMines("win");
    document.getElementById("flagCount").innerHTML = 0;

    //stop timer
    endTimer();

    //show completion time and congratulate
    var message = document.getElementById("message");
    message.classList.add("win");
    message.innerHTML = "<p> Congratulations! You won! </p> <p>Your saved all pups in " + document.getElementById("timer").innerHTML + "s.</p>";

    //disable grid click
    var grid = document.getElementById("minefield");
    grid.classList.add("disable_clicks");
}

// IMPLEMENTED: reveal self (recursive if i have no neighbouring mines)
function revealMyTile(tile){
    var revealedCount = document.getElementById("revealedCount");

    if (tile.number == -1 && tile.flagged == 0){
        bombhit(tile);
    }
    
    if (tile.revealed == 0 && tile.number >= 0 && tile.flagged == 0){
        tile.classList.remove("normal_tile");
        tile.revealed = 1;

        //decrement revealed count and check if we're at winning condition
        revealedCount.count = Number(revealedCount.count) - 1;
        //console.log(revealedCount.count);
        //console.log(revealedCount.original);
        if (revealedCount.count == 0){
            gameWin();
        }


        if (tile.number == 0){
            tile.classList.add("clear");
            revealMyNeighbours(tile);
        }
        else if (tile.number == 1){
            tile.classList.add("tile_1");
        }
        else if (tile.number == 2){
            tile.classList.add("tile_2");
        }
        else if (tile.number == 3){
            tile.classList.add("tile_3");
        }
        else if (tile.number == 4){
            tile.classList.add("tile_4");
        }
        else if (tile.number == 5){
            tile.classList.add("tile_5");
        }
        else if (tile.number == 6){
            tile.classList.add("tile_6");
        }
        else if (tile.number == 7){
            tile.classList.add("tile_7");
        }
        else if (tile.number == 8){
            tile.classList.add("tile_8");
        }   
        
    }
}

// IMPLEMENTED: smiley face for limbo

function handleTileDown(event) {
    if(event.which === 1){
        if (event.target.flagged == 0 && event.target.revealed == 0){
        var smiley = document.getElementById("smiley");
        smiley.classList.add("face_limbo");
        event.target.classList.remove("normal_tile");
        event.target.classList.add("clear");
        }
    }   
}

//IMPLEMENTED: sequence of events that happen when you hit a bomb

function bombhit(bombtile){
    //show the hit mine
    bombtile.classList.remove("normal_tile");
    bombtile.classList.add("mine_hit");
    bombtile.revealed = 1;
    //console.log("BOMB!");

    //reveal all the mines (if marked wrong show that as well)
    revealMines("lose");

    //smiley should be dead
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_lose");

    //timer stops
    endTimer();

    //announce lost
    var message = document.getElementById("message");
    message.classList.add("lose");
    message.innerHTML = "<p> Oh no! You lost! </p>";

    //can't click the whole board except smiley
    var grid = document.getElementById("minefield");
    grid.classList.add("disable_clicks");
}

function handleTileClick(event) {

    // Left Click
    if (event.which === 1) {
        //IMPLEMENTED: reveal the tile
        //console.log(event.which);
        //console.log(event.target.coordinates);

        var revealedCount = document.getElementById("revealedCount");
        //if first ever click
        if (revealedCount.count == revealedCount.original){
            
            //start the timer
            startTimer();
            //plant mines and determine tile numbers
            makeGameboard(event.target);

        }

        //if it's not flagged and not revealed already
        if (event.target.flagged == 0 && event.target.revealed == 0){

            var smiley = document.getElementById("smiley");
            smiley.classList.remove("face_limbo");
            event.target.classList.remove("clear");
            //If we hit a bomb
            if (event.target.number == -1){
                bombhit(event.target);
            }

            //if we hit no mine vicinity or hit a number
            else if (event.target.number >= 0){
                //reveal self, find my neighbours and recursively reveal them if we are no mine zone
                revealMyTile(event.target);
            }


        } //if it's not flagged and not revealed already
    }

    // Middle Click
    else if (event.which === 2) {
        //IMPLEMENTED: reveal adjacent tiles
        //console.log(event.which);
        //console.log(event.target.coordinates);

        /*  1) reveal neighbours if 1) tile clicked is revealed
            2) tile clicked has a number
            3) number of flags in neighbours matches number on tile
        */
        var numflags = 0;
        var neighbours = findMyNeighbours(event.target.coordinates);
        var grid = document.getElementById("minefield");

        for (var a = 0; a < neighbours.length; a++){
            if (grid.childNodes[neighbours[a]].flagged == 1){
                numflags += 1;
            }
        }

        if (event.target.revealed == 1 && event.target.number > 0 && event.target.number == numflags){
            revealMyNeighbours(event.target);
        }
    }

    // Right Click
    else if (event.which === 3) {

        var flagCount = document.getElementById("flagCount");
        //IMPLEMENTED: toggle a tile flag
        //console.log(event.which);
        //console.log(event.target.coordinates);

        //if not yet revealed
        if(event.target.revealed == 0){
            //if not yet flagged
            if (event.target.flagged == 0){
                event.target.flagged = 1;
                event.target.classList.add("flag");
                flagCount.innerHTML = Number(flagCount.innerHTML) - 1;
            }
            else if (event.target.flagged == 1){
                event.target.flagged = 0;
                event.target.classList.remove("flag");
                flagCount.innerHTML = Number(flagCount.innerHTML) + 1;
            }

        }
        
    }
}

// IMPLEMENTED: if a given coordinate is a mine
function isAMine(coordinates, mines) {
    for (var i = 0; i< mines.length; i++){
        if (mines[i].x == coordinates.x && mines[i].y == coordinates.y ){
            return true;
        }
    }
    return false;
}

// IMPLEMENTED: if a tile is part of the neighbours
function isANeighbour(neighbours, othertile){
    var grid = document.getElementById("minefield");
    for (var a = 0; a < neighbours.length; a++){
        if (grid.childNodes[neighbours[a]].coordinates.x == othertile.x && 
            grid.childNodes[neighbours[a]].coordinates.y == othertile.y){
            return true;
        }
    }
    return false;
}

// IMPLEMENTED: populate the gameboard on the first click, make mines, update neighbouring tile numbers
function makeGameboard(firsttile) {
    //make mines
    var difficulty = document.getElementById("difficulty");
    var grid = document.getElementById("minefield");
    var mines = [];

    var neighbours = findMyNeighbours(firsttile.coordinates);

    for (var i = 0; i < difficulty.nummines; i++){
        var x = (Math.floor(Math.random() * 100)) % difficulty.columns;
        var y = (Math.floor(Math.random() * 100)) % difficulty.rows;

        /* 3 conditions: if it's a mine already or 
        if it's the first click, or 
        if it's a neighbour of the first click then it cannot be a mine    
        */
        if (isAMine({x,y}, mines) || (firsttile.coordinates.x == x && firsttile.coordinates.y == y ) || isANeighbour(neighbours, {x,y})){
            i--;
        }
        else{
            mines.push({x,y});
        }
    }
    //console.log(mines);
    grid.mines = mines;

    //mark the mines

    for (var i = 0; i < grid.childNodes.length; i++){
        if (isAMine(grid.childNodes[i].coordinates, mines)){
            grid.childNodes[i].number = -1;
        }
    }

    //traverse through board,find bombs and set numbers to their neighbours
    for (var i = 0; i < grid.childNodes.length; i++){
        if (isAMine(grid.childNodes[i].coordinates, mines)){
            var neighbours = findMyNeighbours(grid.childNodes[i].coordinates);
            for (var a = 0; a < neighbours.length; a++){
                if (grid.childNodes[neighbours[a]].number != -1){ //if it's not a mine itself
                    grid.childNodes[neighbours[a]].number += 1;
                }
            }
        }
    }
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;
    
    var rows, columns, nummines;


    // IMPLEMENTED: set rows and cols according to difficulty level
    if (difficulty == 0){
        rows = 9;
        columns = 9;
        nummines = 10;
    }
    else if (difficulty == 1){
        rows = 16;
        columns = 16;
        nummines = 40;
    }
    else if (difficulty == 2){
        rows = 16;
        columns = 30;
        nummines = 99;
    }
    difficultySelector["rows"] = rows;
    difficultySelector["columns"] = columns;
    difficultySelector["nummines"] = nummines;

    var flagCount = document.getElementById("flagCount");
    flagCount.innerHTML = nummines;

    //how many we need to reveal to win
    var revealedCount = document.getElementById("revealedCount");
    revealedCount["count"] = (rows*columns) - nummines ;
    revealedCount["original"] = revealedCount["count"];
}

function startTimer() {
    timeValue = 0;
    window.myTimer = window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}

function endTimer(){
    window.clearInterval(myTimer);
}