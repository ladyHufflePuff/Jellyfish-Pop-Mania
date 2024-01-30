const userArray = localStorage.getItem("users"); // retreiving users array from HTML local storage
const users = JSON.parse(userArray);
let players = [] ;
const tableBody = document.querySelector("table tbody");

document.addEventListener('DOMContentLoaded', function () {
    //appending nececerry user details from the user array to  aplayer array to be ranked
    users.forEach(user => {
        const username = user.username;
        const highscore = user.highscore;
        const level = user.level;
        let player ={'username':username,'level':level, 'score': highscore};
        players.push(player);
    });
    const sortedPlayers = players.slice().sort((playera, playerb) => playerb.score - playera.score); // sorting players by descending order of high scores
    
    // entering sorted player details into leader board
    sortedPlayers.forEach((player, index) => {
        const row = tableBody.insertRow(); // new player roww
        const rankCell = row.insertCell(0);
        const usernameCell = row.insertCell(1);
        const levelCell = row.insertCell(2);
        const scoreCell = row.insertCell(3);

        rankCell.textContent = index + 1; 
        usernameCell.textContent = player.username;
        levelCell.textContent = player.level;
        scoreCell.textContent = player.score;
    });
});