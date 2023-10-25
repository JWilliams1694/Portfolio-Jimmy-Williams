class Circle extends PIXI.Sprite {
    constructor(color, radius, v) {
        super();
        this.radius = radius;
        this.v = v;
        let circle = new PIXI.Graphics();
        circle.beginFill(color);
        circle.drawCircle(0, 0, radius);
        circle.visible = false;
        circle.endFill();
        circle.x = radius;
        circle.y = radius;

        gameScene.addChild(circle);
        this.circle = circle;
    }

    remove() {
        gameScene.removeChild(this.circle);
    }

    collide(other) {
        let dx = other.circle.x - this.circle.x;
        let dy = other.circle.y - this.circle.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        return dist < (this.radius + other.radius);
    }

}

class Player extends Circle {
    constructor(color, radius, v) {
        super(color, radius, v);
        this.reset();
    }

    reset() {
        this.circle.x = sceneWidth / 2;
        this.circle.y = sceneHeight / 2;
        this.speed = 8;
    }

    update() {
        let x = this.circle.x + this.v.x;
        let y = this.circle.y + this.v.y;

        this.circle.x = Math.min(Math.max(x, this.radius), sceneWidth - this.radius);
        this.circle.y = Math.min(Math.max(y, this.radius), sceneWidth - this.radius);

        pokeballSprite.x = x;
        pokeballSprite.y = y;

        pokemonSprite.x = pokemon.circle.position.x;
        pokemonSprite.y = pokemon.circle.position.y;

        for (let i = 0; i < fuzzies.length; i++) {
            enemySprites[i].x = fuzzies[i].circle.position.x;
            enemySprites[i].y = fuzzies[i].circle.position.y;
            enemySprites[i].rotation += .05;
        };

        fuzzies.forEach(m => {
            if (this.collide(m)) {
                gameOver();
                hurtSound.play();
                for (let i = 0; i < enemySprites.length; i++) {
                    enemySprites[i].x = -100;
                    enemySprites[i].y = -100;
                }
                return;
            }
        });

        // collectable
        if (this.collide(pokemon)) {
            updateScore(score + 1);
            pokemon.random();
            collectSound.play();
            addFuzzy();
            this.speed = Math.min(this.speed, this.speed + 0.2);

            return;
        }
    }
}

class Fuzzy extends Circle {
    constructor(color, radius, v) {
        super(color, radius, v);
    }
    update() {
        let x = this.circle.x += this.v.x;
        let y = this.circle.y += this.v.y;

        if (this.circle.x >= sceneWidth - this.radius) {
            this.v.x *= -1;
        }

        else if (this.circle.x <= this.radius) {
            this.v.x *= -1;
        }

        if (this.circle.y >= sceneHeight - this.radius) {
            this.v.y *= -1;
        }
        else if (this.circle.y <= this.radius) {
            this.v.y *= -1;
        }

    }
}

class Pokemon extends Circle {
    random() {
        this.circle.x = this.radius + 50 + Math.random() * (sceneWidth - 10 * this.radius);
        this.circle.y = this.radius + 10 + Math.random() * (sceneHeight - 10 * this.radius);
    }

    update() {

    }
}