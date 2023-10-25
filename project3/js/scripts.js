const app = new PIXI.Application({
    width: 1600,
    height: 600
});
app.renderer.view.style.touchAction = 'auto';
//game stuff
let fuzzies = [];
let pokemonList = [];
let enemySprites = [];
let pressed = {};
let player;
let score;
let pokemon;
let pokeballSprite;
let pokemonSprite;

//scene stuff
let stage;
let startScene;
let gameScene;
let endScene;
let gameOverScoreLabel;
let sceneWidth = app.view.width;
let sceneHeight = app.view.height;

app.loader.
    add([
        "images/pokeball.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();


function addFuzzy() {
    fuzzies.push(new Fuzzy(0, 18, { x: 4 + Math.random(), y: 2 + Math.random() }));
    changePokemon();
}

function onkeydown(ev) {
    switch (ev.key) {
        case "ArrowLeft":
        case "a":
            player.v.x = -player.speed;
            pressed['left'] = true;
            break;

        case "ArrowRight":
        case "d":
            player.v.x = player.speed;
            pressed['right'] = true;
            break;

        case "ArrowUp":
        case "w":
            player.v.y = -player.speed;
            pressed['up'] = true;
            break;

        case "ArrowDown":
        case "s":
            player.v.y = player.speed;
            pressed['down'] = true;
            break;
    }
}
function onkeyup(ev) {
    switch (ev.key) {
        case "ArrowLeft":
        case "a":
            player.v.x = pressed['right'] ? player.speed : 0;
            pressed['left'] = false;
            break;

        case "ArrowRight":
        case "d":
            player.v.x = pressed['left'] ? -player.speed : 0;
            pressed['right'] = false;
            break;

        case "ArrowUp":
        case "w":
            player.v.y = pressed['down'] ? player.speed : 0;
            pressed['up'] = false;
            break;

        case "ArrowDown":
        case "s":
            player.v.y = pressed['up'] ? -player.speed : 0;
            pressed['down'] = false;
            break;
    }
}

function setupControls() {
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
}

function gameOver() {
    // clear level
    fuzzies.forEach(m => {
        m.remove();
    });
    fuzzies = [];
    player.reset();
    // set final score
    gameOverScoreLabel.text = `Final Score: ${score}`;

    endScene.visible = true;
    gameScene.visible = false;
}


// implement startGame
function startGame() {
    startScene.visible = false;
    endScene.visible = false;
    gameScene.visible = true;
    player = new Player(0, 20, { x: 0, y: 0 });
    pokemon = new Pokemon(0, 20, { x: 0, y: 0 });

    player.reset();
    pokemon.random();
    updateScore(0);
    setupControls();
}

function updateScore(num) {
    score = num;
    document.querySelector('#score span').innerHTML = score;
}

function gameLoop() {
    player.update();
    pokemon.update();
    for (let i = 0; i < fuzzies.length; i++) {
        fuzzies[i].update();
    };
}

//sounds
const hurtSound = new Howl({
    src: ["sounds/SuperEffective.mp3"]
});
const collectSound = new Howl({
    src: ["sounds/rupee.wav"]
});

function setup() {
    stage = app.stage;
    setInterval(gameLoop, 1000 / 60);
    // make start scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    // make game and end scene 
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);
    endScene = new PIXI.Container();
    endScene.visible = false;
    stage.addChild(endScene);

    app.renderer.backgroundColor = 545358;
    document.querySelector("div#canvas").appendChild(app.view);

    createLabelsAndButtons();
    //sounds
    const hurtSound = new Howl({
        src: ["sounds/SuperEffective.mp3"]
    });
    const collectSound = new Howl({
        src: ["sounds/rupee.wav"]
    });

    pokeballSprite = PIXI.Sprite.from("images/pokeball.png");
    pokemonSprite = PIXI.Sprite.from(`images/sprites/${Math.floor(Math.random() * 649) + 1}.png`)
    pokemonSprite.width = 100;
    pokemonSprite.anchor.set(0.5);
    pokemonSprite.height = 100;

    for (let i = 0; i < 100; i++) {
        let fuzzySprite = PIXI.Sprite.from("images/fuzzy.png");
        fuzzySprite.width = 45;
        fuzzySprite.height = 45;
        fuzzySprite.x = -100;
        fuzzySprite.y = -100;
        fuzzySprite.anchor.set(0.5);
        enemySprites.push(gameScene.addChild(fuzzySprite));
    }

    for (let i = 0; i < 100; i++) {
        pokemonList[i] = PIXI.Sprite.from(`images/sprites/${Math.floor(Math.random() * 649) + 1}.png`);
    }

    // create labels 

    gameScene.addChild(pokemonSprite);
    gameScene.addChild(pokeballSprite);

    //move player
    pokeballSprite.anchor.set(0.5);
    pokeballSprite.x = app.screen.width / 2;
    pokeballSprite.y = app.screen.height / 2;
    pokeballSprite.width = 50;
    pokeballSprite.height = 50;
}

function changePokemon() {
    let temp = pokemonList[Math.floor(Math.random() * pokemonList.length)].texture;
    pokemonSprite.texture = (temp);
}


//creates labels
function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Press Start 2P"
    });
    // 1 - set up 'startScene'
    // 1A - make top start label
    let startLabel1 = new PIXI.Text("Catch 'em all!");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 50,
        fontFamily: "Press Start 2P",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x = sceneWidth / 3.5;
    startLabel1.y = sceneHeight / 5;
    startScene.addChild(startLabel1);

    // 1B - make middle start label
    let startLabel2 = new PIXI.Text("Catch as many Pokemon as you can!");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 22,
        fontFamily: "Press Start 2P",
        fontStyle: "italic",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel2.x = sceneWidth / 3.6;
    startLabel2.y = sceneHeight / 2;
    startScene.addChild(startLabel2);

    // 1C - make start game button
    let startButton = new PIXI.Text("PLAY!");
    startButton.style = buttonStyle;
    startButton.x = sceneWidth / 2.2;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame); // startGame is a function reference
    startButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0); //ditto
    startScene.addChild(startButton);

    //2 - set up 'gameScene'
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFF,
        fontSize: 18,
        fontFamily: "Press Start 2P",
        stroke: 0xFF0000,
        strokeThickness: 4
    });

    // 3 - set up `gameOverScene`

    // 3A - make game over text
    let gameOverText = new PIXI.Text("Game Over!");
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 50,
        fontFamily: "Press Start 2P",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    gameOverScoreLabel = new PIXI.Text(`Final Score: ${score}`);
    gameOverScoreLabel.style = textStyle;
    gameOverScoreLabel.x = sceneWidth / 3.3;
    gameOverScoreLabel.y = sceneHeight / 2;
    gameOverScoreLabel.fontSize = 1;

    endScene.addChild(gameOverScoreLabel);

    gameOverText.style = textStyle;
    gameOverText.x = sceneWidth / 2.8;
    gameOverText.y = sceneHeight / 2 - 160;
    endScene.addChild(gameOverText);

    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text("PLAY AGAIN!");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = sceneWidth / 3;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame); // startGame is a function reference
    playAgainButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto
    endScene.addChild(playAgainButton);
}