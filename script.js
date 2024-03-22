(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let player = {
    x: 375,
    y: 565,
    width: 30,
    height: 30,
    speed: 4,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    color: 'rgb(186, 91, 60)'
};
let keys = [];
let platforms = [];
let spikes = [];
let trophy = {
    x: 20,
    y: 100,
    width: 30,
    height: 30,
    color: 'rgb(255, 255, 0)'
}
let friction = 0.8;
let gravity = 0.4;


// Platforms
platforms.push({
    x: 50,
    y: 500,
    width: 150,
    height: 20,
    color: 'rgb(0, 255, 0)'
})

platforms.push({
    x: 300,
    y: 380,
    width: 150,
    height: 20,
    color: 'rgb(255, 0, 0)'
})

platforms.push({
    x: 100,
    y: 220,
    width: 350,
    height: 20,
    color: 'rgb(0, 0, 255)'
})

platforms.push({
    x: 600,
    y: 300,
    width: 40,
    height: 20,
    color: 'rgb(155, 0, 155)'
})

platforms.push({
    x: 0,
    y: 150,
    width: 100,
    height: 20,
    color: 'rgb(255, 255, 0)'
})

// Spikes
spikes.push({
    startX: 100, startY: 220,
    lineAx: 130, lineAy: 220,
    lineBx: 115, lineBy: 200,
    lineCx: 100, lineCy: 220,
    width: 30, height: 30,
    x: 100, y: 220-30,
    color: 'rgb(0, 0, 0)'
})

spikes.push({
    startX: 190, startY: 220,
    lineAx: 220, lineAy: 220,
    lineBx: 205, lineBy: 200,
    lineCx: 190, lineCy: 220,
    width: 30, height: 30,
    x: 190, y: 220-30,
    color: 'rgb(0, 0, 0)'
})

spikes.push({
    startX: 190+90, startY: 220,
    lineAx: 220+90, lineAy: 220,
    lineBx: 205+90, lineBy: 200,
    lineCx: 190+90, lineCy: 220,
    width: 30, height: 30,
    x: 190+90, y: 220-30,
    color: 'rgb(0, 0, 0)'
})

spikes.push({
    startX: 190+90+90, startY: 220,
    lineAx: 220+90+90, lineAy: 220,
    lineBx: 205+90+90, lineBy: 200,
    lineCx: 190+90+90, lineCy: 220,
    width: 30, height: 30,
    x: 190+90+90, y: 220-30,
    color: 'rgb(0, 0, 0)'
})


function update() {
    // Check keys
    if (keys['ArrowUp'] || keys[' '] || keys['w']) {
        // Up arrow, Space, W
        if (player.grounded && !player.jumping) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2.5; // Jump height
        }
    }
    if (keys['ArrowRight'] || keys['d']) {
        // Right arrow, D
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys['ArrowLeft'] || keys['a']) {
        // Left arrow, A
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    // Applies friction and gravity
    player.velX *= friction;
    player.velY += gravity;

    if(player.grounded){
        player.velY = 0;
   }
    
    // Clears canvas
    canvas.width = canvas.width 
    
    // Draws platforms, checks collision
    player.grounded = false;
    for (i = 0; i < platforms.length; i++) {
        ctx.fillStyle = platforms[i].color;
        ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);

        var colEdge = colCheck(player, platforms[i]);

        if (colEdge === "L" || colEdge === "R") {
            player.velX = 0;
            player.jumping = false;
        } else if (colEdge === "B") {
            player.grounded = true;
            player.jumping = false;
        } else if (colEdge === "T") {
            player.velY *= -1;
        }
    }

    // Draws spikes, checks collision
    for (i = 0; i < spikes.length; i++) {
        ctx.fillStyle = spikes[i].color;
        ctx.beginPath();
        ctx.moveTo(spikes[i].startX, spikes[i].startY);
        ctx.lineTo(spikes[i].lineAx, spikes[i].lineAy);
        ctx.lineTo(spikes[i].lineBx, spikes[i].lineBy);
        ctx.lineTo(spikes[i].lineCx, spikes[i].lineCy);
        ctx.fill();

        if(colCheck(player, spikes[i]) !== null){
            player.x = 375;
            player.y = 565;
        }
    }

    // Draws trophy, checks collision
    ctx.fillStyle = trophy.color;
    ctx.fillRect(trophy.x, trophy.y, trophy.width, trophy.height);
    if(colCheck(player, trophy) !== null){
        alert("You win!");
        player.x = 375;
        player.y = 565;
    }

    // Checks collision against borders of canvas
    collisionBorders();

    // Moves character
    player.x += player.velX;
    player.y += player.velY;

    // Draws player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    requestAnimationFrame(update);
}

// Checks collision against borders of canvas
function collisionBorders() {
    if (player.y > canvas.height - 30) {
        player.y = canvas.height - 30;
        player.grounded = true;
        player.jumping = false;
        player.velY = 0;
    }
    if (player.y < 0) {
        player.y = 0;
        player.velY = 0;
    }
    if (player.x > canvas.width - 30) {
        player.x = canvas.width - 30;
        player.velX = 0;
    }
    if (player.x < 0) {
        player.x = 0;
        player.velX = 0;
    }
}

// Checks collision against platforms
function colCheck(character, platform) {
    // Get the vectors to check against
    let vX = (character.x + (character.width / 2)) - (platform.x + (platform.width / 2)),
        vY = (character.y + (character.height / 2)) - (platform.y + (platform.height / 2)),
        // Add the half widths and half heights
        hWidths = (character.width / 2) + (platform.width / 2),
        hHeights = (character.height / 2) + (platform.height / 2),
        colEdge = null;

    // If the x and y vector are less than half width or half height, they must be colliding
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // Figures out what side is colliding (Top, Bottom, Left, or Right)
        let oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colEdge = "T";
                character.y += oY;
            } else {
                colEdge = "B";
                character.y -= oY;
            }
        } else {
            if (vX > 0) {
                colEdge = "L";
                character.x += oX;
            } else {
                colEdge = "R";
                character.x -= oX;
            }
        }
    }
    return colEdge;
}

// Adds key to keys array
document.body.addEventListener("keydown", function(e) {
    keys[e.key] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.key] = false;
});

window.addEventListener("load", function() {
    update();
});