"use strict";

class Game {
    constructor() {
        this.grid = 42;
        this.rows = 11;
        this.columns = 24;

        this.canvas = document.getElementById("canvas");
        this.canvas.width = this.grid * this.columns;
        this.canvas.height = this.grid * this.rows;
        this.context = this.canvas.getContext("2d");

        //spongebob character object
        this.shooter = {
            x: this.grid * this.columns / 2 - (this.grid * 2),
            y: this.grid * this.rows - this.grid * 2,
            width: this.grid * 4,
            height: this.grid * 2,
            velocityX: this.grid, // shooter moving speed
            img: new Image(),
        };

        //school of jellyfish initialization
        this.jellyfishArray = ['Styling/Images/green.png'];
        this.jellyfishWidth = this.grid;
        this.jellyfishHeight = this.grid;
        this.jellyfishXPosition = this.grid;
        this.jellyfishYPosition = this.grid;
        this.jellyfishRows = 3;
        this.jellyfishColumns = 5;
        this.jellyfishCount = 0;
        this.jellyfishDisplacement = 0.3; //floating jellyfish moving speed

        //array of jellyfish colours for random selection
        this.jellyfishColour = {
            'Orange': 'Styling/Images/orange.png',
            'Cyan': 'Styling/Images/cyan.png',
            'Green': 'Styling/Images/green.png',
            'Maroon': 'Styling/Images/maroon.png',
            'Purple': 'Styling/Images/purple.png',
            'Pink': 'Styling/Images/lilac.png',
        };
        
        // eliminating jellyfish array initialization
        this.availableColours =['Orange','Cyan','Green','Maroon', 'Purple','Pink',]
        this.quantity = 50
        this.selection = Array.from({ length: this.quantity}, () => this.availableColours[Math.floor(Math.random() * this.availableColours.length)]);
        this.eliminatingJellyfishArray = [];
        this.eliminatingJellyfishDisplacement = -10; //eliminatingjellyfish moving speed
        this.moves = document.getElementById("moves");
        
        // level initialization
        this.stage = 1;
        this.round = ""
        this.level = document.getElementById("level");
        
        //score initialization
        this.points= 0;
        this.score = document.getElementById("score");
        this.highscoreFeild = document.getElementById("highscore");
        this.highscore = JSON.parse(localStorage.getItem("highscore"));
       
        // retreiving current user details from local storage
        this.username = JSON.parse(localStorage.getItem("username"));
        this.users = JSON.parse(localStorage.getItem("users")) ||[];
        this.userIndex = this.users.findIndex(user => user.username === this.username);  
        
        // retreiving sound and music state from local storage
        this.SoundEnabled =  JSON.parse(localStorage.getItem("sound"));
        this.collisionSound = document.getElementById("collision_sound");
        this.shockSound = document.getElementById("shock_sound");
        this.screamSound = document.getElementById("scream_sound");
        this.MusicEnabled =  JSON.parse(localStorage.getItem("music"));
        if (this.MusicEnabled) {
           this.MusicEnabled = new Audio();
           this.MusicEnabled.src = "Styling/Audio/backgroundmusuc.mp3"; 
           this.MusicEnabled.loop = true;
           this.MusicEnabled.play();
        }
        
        // initializing pause and game over popup
        this.pauseGame = document.getElementById("pause");
        this.resume =  document.getElementById("resume_game");
        this.restart = document.getElementById("restart_game");
        this.pausePopup = document.getElementById("pause_popup");
        this.gameOverPopup = document.getElementById("game_over_popup");
        this.pause = false;
        this.gameOver = false;
        

        this.EventListeners();
        this.loadImages();
        this.createJellyfish();
        this.update();

    }

    EventListeners() {
        window.onload = () => {
            document.addEventListener("keydown", (e) => this.shooterDisplacement(e));
            document.addEventListener("keyup", (e) => this.shoot(e));
            this.pauseGame.addEventListener("click", () =>{this.Paused();});
            this.resume.addEventListener("click", () =>{this.Resume();});
            
        };
    }

    loadImages() {
        // spongebob image
        this.shooter.img.src = "Styling/Images/spongebob.png";
        this.shooter.img.onload = () => this.context.drawImage(this.shooter.img, this.shooter.x, this.shooter.y, this.shooter.width, this.shooter.height);

        // swimming jellyfishes image
        for (let color in this.jellyfishColour) {
            let img = new Image();
            img.src = this.jellyfishColour[color];
            this.jellyfishColour[color] = img;
        }
    }
    
    // method to update game animations and functions in realtime
    update() {
        requestAnimationFrame(() => this.update());
        if(this.pause){
            return;
        }
        if (this.gameOver){
            return;
        }

        this.round = ("level " + this.stage);
        this.level.innerHTML= this.round; //update level
        this.score.innerHTML = this.points; //update score

        this.highscoreFeild.innerHTML = this.highscore // display current user high score from local storage
        // update highscore and level highscore was obtained to HTML local storage 
        if (this.points > this.highscore ){
            this.highscoreFeild.innerHTML = this.points; // update highscore feild
            localStorage.setItem("highscore", JSON.stringify(this.points.toString()));
            localStorage.setItem("level",JSON.stringify(this.round))
            if (this.userIndex !== -1) {
                this.users[this.userIndex]["highscore"] = this.points.toString();
                localStorage.setItem("users", JSON.stringify(this.users)); 
                this.users[this.userIndex]["level"] = this.round
                localStorage.setItem("users", JSON.stringify(this.users));
            }    
        }

        this.eliminatingJellyfishColours= this.selection;
        this.moves.innerHTML = this.eliminatingJellyfishColours.length;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // deleting the character  at  old position when shooter is moved to prevent overlappimg
        
        //dome above spongebob character
        this.context.fillStyle = this.eliminatingJellyfishColours[0]; // matching the colour of the dome to the next eliminating jellyfish to be launched
        this.context.beginPath();
        this.context.arc(this.shooter.x + this.shooter.width / 2, this.shooter.y -1, 6, 0, 2 * Math.PI);
        this.context.fill();
        this.context.drawImage(this.shooter.img, this.shooter.x, this.shooter.y, this.shooter.width, this.shooter.height);

     
        // updating school of swiming jellyfishes position and array size
        for (let i = 0; i < this.jellyfishArray.length; i++) {
            let jellyfish = this.jellyfishArray[i];
            if (jellyfish.alive) {
                jellyfish.x += this.jellyfishDisplacement;
                if (jellyfish.x + jellyfish.width >= this.canvas.width || jellyfish.x <= 0) {
                    this.jellyfishDisplacement *= -1; //moving jellyfishes along the horizeontal axis of the canvas
                    jellyfish.x += this.jellyfishDisplacement * 2;
                    for (let j = 0; j < this.jellyfishArray.length; j++) {
                        this.jellyfishArray[j].y += this.jellyfishHeight;
                    } // moving jellishishes a row downward on collision with either edge of the canvas
                }
                this.context.drawImage(jellyfish.color, jellyfish.x, jellyfish.y, jellyfish.width, jellyfish.height);
            }
            // game over condition to detect when school of jellyfishes comes in contact with spongebob character
            if (jellyfish.y >= this.shooter.y && jellyfish.x >= this.shooter.x){
                this.gameOver= true;
                this.openPopup(this.gameOverPopup);
                // game over effects
                if(this.MusicEnabled){
                 this.MusicEnabled.pause();}
                this.context.clearRect(this.shooter.x, this.shooter.y, this.shooter.width, this.shooter.height);
                this.shooter.img.src = "Styling/Images/screamingspongebob.png";
                this.shooter.width = this.grid * 6;
                this.shooter.height = this.grid * 2;
                this.context.drawImage(this.shooter.img, this.shooter.x , this.shooter.y, this.shooter.width, this.shooter.height)
                this.playShockSound();
                this.playScreamSound();
            } 
        }
       
        
        // updating eliminating jellyfishes position and array size
        for (let i = 0; i < this.eliminatingJellyfishArray.length; i++) {
            let eliminatingJellyfish = this.eliminatingJellyfishArray[i];
            eliminatingJellyfish.y += this.eliminatingJellyfishDisplacement;
            this.context.drawImage(eliminatingJellyfish.color, eliminatingJellyfish.x, eliminatingJellyfish.y, eliminatingJellyfish.width, eliminatingJellyfish.height);
           
            for (let j = 0; j < this.jellyfishArray.length; j++) {
                let jellyfish = this.jellyfishArray[j];
                if (!eliminatingJellyfish.used && jellyfish.alive && this.Collision(eliminatingJellyfish, jellyfish)) {
                    // condition to detect when an eliminating jellyfish is the same colour as the swimming jellyfish it was lanched at
                    if (eliminatingJellyfish.color === jellyfish.color) {
                        this.playCollisionSound();
                        jellyfish.alive = false;
                        this.jellyfishCount--;
                        this.points += 5;
                    }
                    // condition to add eliminating jellyfish to  swimming jellyfishes array if it is not he same colour as the jellyfish it was launched at
                    else {
                        let newJellyfish = {
                            color: eliminatingJellyfish.color,
                            x: jellyfish.x,
                            y: jellyfish.y + this.jellyfishHeight,
                            width: this.jellyfishWidth,
                            height: this.jellyfishHeight,
                            alive: true,
                        };
                        this.jellyfishArray.push(newJellyfish);
                        this.jellyfishCount++;
                    }
                    eliminatingJellyfish.used = true;  
                }
            }  
           
        }

        // removes eliminating jellyfish from eliminating jelly fish array once launched
        while (this.eliminatingJellyfishArray.length > 0 && (this.eliminatingJellyfishArray[0].used || this.eliminatingJellyfishArray[0].y < 0)) {
            this.eliminatingJellyfishArray.shift(); 
        }

        // create new level
        if (this.jellyfishCount == 0){
            this.jellyfishColumns = Math.min(this.jellyfishColumns+1, this.columns-2);// increase size of floating jellyfish
            this.jellyfishDisplacement += 0.2 ; // increase speed of floating jellyfish
            this.jellyfishArray = []; //reset floating jellyfish array
            this.stage ++; // increase level
            if(this.stage > 1){
                this.quantity += 10;
            } // eliminating jellyfish array increment
            this.selection  = Array.from({ length: this.quantity }, () => this.availableColours[Math.floor(Math.random() * this.availableColours.length)]); // eliminatingJrllyfishArray repopulation
            this.createJellyfish();

            // for moving the jellyfish array on the canvas
            for (let i = 0; i < this.jellyfishArray.length; i++) {
                let jellyfish = this.jellyfishArray[i];
                jellyfish.x += this.jellyfishDisplacement;
                jellyfish.y += this.jellyfishHeight;
            }

        }
    }

    // method to move shooter left and right within the canvas
    shooterDisplacement(e) {
        if(this.pause){
            return;
        }
        if (this.gameOver){
            return;
        }
        if (e.code == "ArrowLeft" && this.shooter.x - this.shooter.velocityX >= 0) {
            this.shooter.x -= this.shooter.velocityX;
        } else if (e.code == "ArrowRight" && this.shooter.x + this.shooter.velocityX + this.shooter.width <= this.canvas.width) {
            this.shooter.x += this.shooter.velocityX;
        }
    }

    // method to populate the jellyfish array for the school of swimming jellyfish
    createJellyfish() {
        this.jellyfishArray = [];
        for (let c = 0; c < this.jellyfishColumns; c++) {
            for (let r = 0; r < this.jellyfishRows; r++) {
                let randomColor = this.availableColours[Math.floor(Math.random() * this.availableColours.length)];
                let jellyfish = {
                    color: this.jellyfishColour[randomColor],
                    x: this.jellyfishXPosition + c * this.jellyfishWidth,
                    y: this.jellyfishYPosition + r * this.jellyfishHeight,
                    width: this.jellyfishWidth,
                    height: this.jellyfishHeight,
                    alive: true,
                };
                this.jellyfishArray.push(jellyfish);
            }
        }
        this.jellyfishCount = this.jellyfishArray.length;
    }
      
    // method to launch eliminating jellyfish
    shoot(e) {
        if(this.pause){
            return;
        }
        if (this.gameOver){
            return;
        }
        if (e.code == "Space") { 
            let eliminatingJellyfish = {
                color: this.jellyfishColour[ this.eliminatingJellyfishColours[0]],
                x: this.shooter.x + this.shooter.width * 11 / 24,
                y: this.shooter.y,
                width: this.jellyfishWidth,
                height: this.jellyfishHeight,
                alive: true,   
            };
            this.eliminatingJellyfishArray.push(eliminatingJellyfish);
            this.eliminatingJellyfishColours.shift();   
        }       
    }

    // mwthod to detect collision between eliminating jellyfish and swimming Jellyfish
    Collision(a, b) {
        let aCenterX = a.x + a.width / 2;
        let aCenterY = a.y + a.height / 2;
        let bCenterX = b.x + b.width / 2;
        let bCenterY = b.y + b.height / 2;
    
        let distanceX = Math.abs(aCenterX - bCenterX);
        let distanceY = Math.abs(aCenterY - bCenterY);
    
        return distanceX < (a.width + b.width) / 2 &&
               distanceY < (a.height + b.height) / 2;
    }

    // method to play collision sound
    playCollisionSound() {
        if (this.SoundEnabled) {
            this.collisionSound.play();
        }
    }

    // method to play shock sound
    playShockSound() {
        if (this.SoundEnabled) {
            this.shockSound.play();
        }
    }

    // method to play scream sound
    playScreamSound() {
        if (this.SoundEnabled) {
            this.screamSound.play();
        }
    }

    // method to initiate pause feature
    Paused(){
       this.pause = true;
       this.openPopup(this.pausePopup);
       if(this.MusicEnabled){
            this.MusicEnabled.pause();
        }
    }

    // method to initiate game resume feature
    Resume(){
        this.pause = false;
        this.closePopup(this.pausePopup); 
        if(this.MusicEnabled){
            this.MusicEnabled.play();
        }  
     }
    
    // method to open popup
    openPopup(action) {
        action.style.display = "block";
    }
   
    // method to close popup
    closePopup(action) {
        action.style.display = "none";
    }

}


const game = new Game();
