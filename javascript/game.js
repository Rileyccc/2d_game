// define gama atributes
var NUMBEROFBAC = 20;
var LIVES = 2;
var numOfBac = 20;
var bacLimit = 5;
var bacteriae = [];
var clicks = []
var score = 0;
var particles = [];
var lives = 2;


// define main playing surface coordinates and radius size, and color
var X = 0;
var Y = 0;
var R = 0.8;
var COLOR = [1,1,1,1];




window.onload = function init()
{
    // get canvas from html doc
    var canvas = document.getElementById('canvas');

    // get a div for displaying game text
    var scoreboard = document.getElementById('scoreboard');
    // get scoreboard elements
    var scoreOut = document.getElementById('score');
    var life1 = document.getElementById('life1');
    var life2 = document.getElementById('life2');
    var numOfBacOut = document.getElementById('bacLeft');


    var gl = canvas.getContext('webgl')
    if ( !gl ) { 
        alert( "WebGL isn't available");
     	gl = canvas.getContext('experimental-webgl');
    }
    if (!gl){
        alert('your browser does not support webgl');
    }
    
    //set canvas size
    canvas.width = window.innerHeight-200;
	canvas.height = window.innerHeight-200;

    // set scoreboard width and height
    scoreboard.style.width = canvas.width + "px"; 
    scoreboard.style.height = '100px';
    
    //set web gl viewport size
	gl.viewport(0,0,canvas.width,canvas.height);
    
    //create and bind vertexBuffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);


    // get shaders from html
    var vertShaderText = document.getElementById("vertex-shader").text;
    var fragShaderText = document.getElementById("fragment-shader").text;
	
    // create shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    // bind shaders to shaders text
    gl.shaderSource(vertexShader, vertShaderText);
    gl.shaderSource(fragmentShader, fragShaderText);

    // compile vertex shader
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error("error compiling the vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    // compile fragmentShader
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error("error compiling the fragement shader!" + gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // create a program
    var program = gl.createProgram();

    // add shaders to program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link program to webgl
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error('error linking the program', gl.getProgramInfo(program) );
        return;
    }

    // start program
    gl.useProgram(program);

    // get attributes locations from shader programs
    var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var fColor = gl.getUniformLocation(program, "fColor");

    // link vertex attribute Pointer to js and enable it
    gl.vertexAttribPointer(
		positionAttribLocation, //attribute location
		2, //number of elements per attribute
		gl.FLOAT, 
		gl.FALSE,
		2*Float32Array.BYTES_PER_ELEMENT,//size of an individual vertex
		0*Float32Array.BYTES_PER_ELEMENT//offset from the beginning of a single vertex to this attribute
		);
    
	gl.enableVertexAttribArray(positionAttribLocation);
    
    // get bounding box for offset of canvas. to find (x, y) orgin of canvas 
    var offset = canvas.getBoundingClientRect();

    // create circle and draws them to screen
    function create_circle(x,y,r,color, bac=false){
        
        var circleVertices = [];
        //generate circles points
        //var stepSize = ((2*Math.PI)/points);
        var j;
        for (var i = 0; i <= 360; i += 1) {
            //add ver
            j = i * Math.PI/180
            circleVertices.push(r * Math.cos(j)+x);
            circleVertices.push(r * Math.sin(j)+y);
            

            circleVertices.push(x);
            circleVertices.push(y);
        }
    
    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices), gl.STATIC_DRAW);
        // set colour
        gl.uniform4f(fColor, color[0], color[1], color[2], color[3]);
        
        //gl.clearColor(0.0,0.0,0.0,1.0);
        //gl.clear(gl.COLOR_BUFFER_BIT);	

        if(bac == true)
            gl.drawArrays(gl.LINE_LOOP,0,360*2+2);
        else
            gl.drawArrays(gl.TRIANGLE_STRIP,0,360*2+2);

        

        
        
    }
    
    class Bacteria{

        constructor(){
            // spawn point
            this.x;
            this.y;
            //initial radius
            this.r = .01;
            this.color = [Math.random()*1, Math.random()*1, Math.random()*1, .8]
            this.consummed = false;
            //this.comsummer = false;

        }

        create(){
            var rand = Math.random()*360
            this.x = R * Math.cos(rand)+X
            this.y = R * Math.sin(rand)+Y

            for(var i = 0; i < bacteriae.length; i++){
                // make sure bacteria don't hit on creation
                if(isColliding(this.x, this.y, this.r, bacteriae[i].x, bacteriae[i].y, bacteriae[i].r))
                    return false;
            }

            return true;

        }

        update(){
            if(this.consummed){
                this.consumed();
                return;
            }
            for(var i = 0; i < bacteriae.length; i++){
                // make sure bacteria don't hit on creation
                if(isColliding(this.x, this.y, this.r, bacteriae[i].x, bacteriae[i].y, bacteriae[i].r)){
                    if(this.r < bacteriae[i].r){
                        //bacteriae[i].comsummer = true;
                        this.consummed = true;
                        var distx = bacteriae[i].x - this.x;
                        var disty = bacteriae[i].y - this.y ;

                    
                        // normalize speed so x and y cordinates are the same as consummer function calls 20 iterations
                        this.xMove = distx/100;
                        this.yMove = disty/100;
                        this.consumeNum = 0;
                    }
                }

                this.r += 0.0001;

                    
            }
        }
        //when being consumed bacteria shrinks and moves into comsumer
        consumed(){
            if(this.consumeNum == 100){
                this.r -= 0.01    
            }else{
                this.r -= 0.001;
                this.x += this.xMove;
                this.y += this.yMove;
                this.consumeNum++;
            }
            if(this.r <= 0){
                this.destroy();
            }
           

        }
        // when eating a bacteria the bacteria eating grows faster
        // consumer(){


        // }


        destroy(){
            score += Math.ceil((.2 - this.r) * 150);
            numOfBac--;
            this.x =0;
            this.y =0;
            this.r =0;
            this.removeMe = true;

        }

    }

    class Particle{

        constructor(x, y, dx, dy, r, color, moves){
            this.x = x;
            this.y = y;
            this.r = r;
            this.color = color;
            this.moves = moves; 
            this.dx = dx;
            this.dy = dy; 
        }

        update(){
            if(this.moves <= 0){
                this.destroy();
            }
            this.x += this.dx;
            this.y += this.dy;
            this.color[3] -=0.01 ;
            this.moves--;
        }
        

        destroy(){
            this.x =0;
            this.y =0; 
            this.r =0;
            this.removeMe =true;
        }



    }
    function create_particles(bacX, bacY, bacColor){
        var numOfParticles = 10 + Math.random()*20
        for(var i =0; i < numOfParticles; i++){

            // randomly generate a positive or negitive num
            var posOrNeg1 = Math.random() < 0.5 ? -1 : 1;
            var posOrNeg2 = Math.random() < 0.5 ? -1 : 1;

            //shift particles slightly in an random direction
            var x = bacX + (Math.random() *.02 * posOrNeg2);
            var y = bacY + (Math.random() *.02 * posOrNeg1);

            // generate rate of change for x and y direction of particles
            dx = Math.random() *.009 * posOrNeg1;
            dy = Math.random() *.009 * posOrNeg2;
            
            // generate random radius
            var r = Math.random() * .02;

            // generate random transparentcy change
            var color = [bacColor[0], bacColor[1], bacColor[2], 1 * Math.random()]

            // generate num of moves
            var moves = Math.random() * 50

            particles.push(new Particle(x, y, dx, dy, r, color,moves));
        }
    }

    // calculate distance between 2 points in 2d
    function distance(x1, y1, x2, y2){
        return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
    }
    // checks if circles are colliding 
    function isColliding(x1, y1, r1, x2, y2, r2){
        // find distance's between radius's
        dist_orgins = distance(x1, y1, x2, y2);
        // find combined radius of circle 1 and 2
        radius_dist = r1+r2
        
        // combined radius greater than distance between orgins circles are colliding
        if(radius_dist > dist_orgins)
            return true;
        
        return false;



    }
    
    // add listner for mouse on canvas
    canvas.onmousedown = function(ev){
            
        var mx = ev.clientX - offset.x;
        var my = ev.clientY - offset.y;
        mx = ((mx / canvas.width) - 0.5) * 2
        my = ((my / canvas.height) - 0.5) * -2 


        clicks.push([mx, my]);
    }
   
    //remove heart
    function removeLife(){
        if(lives == 2){
            life1.remove();
            lives--;
            score += -50    
        }else if(lives == 1){
            life2.remove();
            lives--;
            score += -50
        }
    }
    // if won display you won
    function win(){
         // remove canvas 
         canvas.remove();

         // create a new div to replace canvas
         div = document.createElement('div');
         div.setAttribute("id", "game_over")
         div.style.width = canvas.width + "px";
         div.style.height = canvas.height + "px";
         div.classList.add("win");
 
         // add you lose text
         var paragraph = document.createElement("p");
         paragraph.innerHTML = "You win!";
         div.appendChild(paragraph);
         
         //add button to div
         var button = document.createElement("button");
         button.setAttribute("id", "btn")
         button.appendChild(document.createTextNode("Play Again"));
         button.addEventListener('click', function() {
             resetGame()
         }, false);
         div.appendChild(button);

         // insert game end screen in correct location
        var header = document.getElementById('main_header');
        header.parentNode.insertBefore(div, header.nextSibling)

    }
    // display if you lost
    function lose(){
        // remove canvas 
        canvas.remove();

        // create a new div to replace canvas
        div = document.createElement('div');
        div.setAttribute("id", "game_over")
        div.style.width = canvas.width + "px";
        div.style.height = canvas.height + "px";
        div.classList.add("lose");

        // add you lose text
        var paragraph = document.createElement("p");
        paragraph.innerHTML = "You Lose!";
        div.appendChild(paragraph);
        
        //add button to div
        var button = document.createElement("button");
        button.setAttribute("id", "btn")
        button.appendChild(document.createTextNode("Play Again"));
        button.addEventListener('click', function() {
            resetGame()
        }, false);
        div.appendChild(button);

        // insert game end screen in correct location
        var header = document.getElementById('main_header');
        header.parentNode.insertBefore(div, header.nextSibling)
        


    }
    function addBacteria(){
        var bac = new Bacteria();
        test = false;
        while(!test){ 
            test = bac.create();
        }
        bacteriae.push(bac);
    }

    // create bacteria initially
    for(var i = 0; i < bacLimit; i++){
        addBacteria();
    }

    
    // rendering loop 
    var loop = function(){
        //sort bacteriae array if being consumed move to the front
        bacteriae.sort(function(a){
            if (a.consumed){
                return -1;
            }
            return 1;
        })


        // clear background set colour
        gl.clearColor(0.0,0.0,0.0,1.0);
        // set background color initialy
        gl.clear(gl.COLOR_BUFFER_BIT);	
        // draw game cicle
        create_circle(X, Y, R, COLOR, false);

        // draw bacteria
        for(var i = 0; i < bacteriae.length; i++){
            bacteriae[i].update();
            create_circle(bacteriae[i].x, bacteriae[i].y,bacteriae[i].r ,bacteriae[i].color, true);
            // if bacteria gets to large before being killed you lose a life
            if(bacteriae[i].r > 0.2){
                bacteriae[i].destroy()
                removeLife();
            }
        }

        // remove dead bacteria
        bacteriae.forEach((bac, index, object) =>{
            if(bac.removeMe == true){
                object.splice(index, 1);
            }
        });
        
        // draw particles
        for(var i = 0; i < particles.length; i++){
            particles[i].update();
            create_circle(particles[i].x, particles[i].y,particles[i].r ,particles[i].color, true);
        }

        // remove expired particles
        bacteriae.forEach((bac, index, object) =>{
            if(bac.removeMe == true){
                object.splice(index, 1);
            }
        });
        

        // check clicks array and make to see if any bacterias have been destroyed
        for(var i = 0; i < clicks.length; i++){
            for(var j = 0; j < bacteriae.length; j++){
                // if the distance between click coordinates and bacteria cordinates
                // are less than the radius of bacteria the bacteria has been clicked 
                if(distance(clicks[i][0], clicks[i][1], bacteriae[j].x, bacteriae[j].y) < bacteriae[j].r){
                    // Setup particle origin at bacteria (x, y) origin
                    create_particles(bacteriae[j].x, bacteriae[j].y, bacteriae[j].color)
                    bacteriae[j].destroy();
                }
            }
        }
        // add new bacteria if length of bacteria is less than bac limit
        if(bacteriae.length < bacLimit && bacteriae.length < numOfBac){
            addBacteria();
        }

        
        // check winning and losing conditions
        if(lives == 0){
            lose();
            //break loop
            return;
        }
        if(numOfBac == 0){
            win();
            //break loop
            return;
        }



        //update score and bac remaining
        numOfBacOut.innerHTML = "Bacteria Left: "+numOfBac;
        scoreOut.innerHTML = "Score: " + score
    
        clicks = [];
    
        requestAnimationFrame(loop);
    }  
    requestAnimationFrame(loop);
    
 
}

function resetGame(){
    // remove game over div
    var div = document.getElementById("game_over");
    div.remove();
    
    // add new canvas to the screen
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");

    // add canvas back to screen
    var header = document.getElementById('main_header');
    header.parentNode.insertBefore(canvas, header.nextSibling);

    // reset numOfBac and lives
    numOfBac = NUMBEROFBAC;
    lives = LIVES;
    score = 0;

    // re add lifes if needed
    var span = document.getElementById('score');

    var element = document.getElementById("life1");
    try{
        element.remove();
    }catch(e){
        
    }
    //If it isn't "undefined" and it isn't "null", then it exists.
    
    var life1 = document.createElement("img");
    life1.src = "./images/heart.png";
    life1.setAttribute("id", "life1");
    life1.classList.add("health");
    span.parentNode.insertBefore(life1, span.nextSibling);
     
    
    element = document.getElementById("life2");
    // remove if life exist if not continue
    try{
        element.remove();
    }catch(e){
        
    }

    var life2 = document.createElement("img");
    life2.src = "./images/heart.png";
    life2.setAttribute("id", "life2");
    life2.classList.add("health");
    span.parentNode.insertBefore(life2, span.nextSibling);
     
    // empty bateriae and particles
    bacteriae =[];
    particles =[];
    //reset game
    window.onload();
}






