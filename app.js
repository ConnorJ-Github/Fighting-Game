const canvas = document.querySelector("canvas")

const c = canvas.getContext("2d")

canvas.width = 1020
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

class Sprite {
  constructor({ position, velocity, colour = "red", offset }) {
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastkey
    this.attackbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    }
    this.colour = colour
    this.isAttacking
    this.health = 100
  }

  draw() {
    c.fillStyle = this.colour
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //atack Box
    if (this.isAttacking) {
      c.fillStyle = "green"
      c.fillRect(
        this.attackbox.position.x,
        this.attackbox.position.y,
        this.attackbox.width,
        this.attackbox.height
      )
    }
  }

  update() {
    this.draw()

    this.attackbox.position.x = this.position.x + this.attackbox.offset.x
    this.attackbox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
}

const player = new Sprite({
  position: {
    x: 50,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  colour: "blue",
})

const enemy = new Sprite({
  position: {
    x: 900,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
})

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackbox.position.x + rectangle1.attackbox.width >=
      rectangle2.position.x &&
    rectangle1.attackbox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackbox.position.y + rectangle1.attackbox.height >=
      rectangle2.position.y &&
    rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

let timer = 10

function decreaseTimer() {
  if (timer > 0) {
    setTimeout(decreaseTimer, 1000)
    timer--
    document.getElementById("timer").innerHTML = timer
  }

  if (timer === 0) {
    document.getElementById("outcome").style.display = "flex"
    if (player.health === enemy) {
      document.getElementById("outcome").innerHTML = "Tie!"
    } else if (player.health > enemy.health) {
      document.getElementById("outcome").innerHTML = "Player Wins!"
    } else {
      document.getElementById("outcome").innerHTML = "Enemy Wins!"
    }
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black"
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0

  if (keys.a.pressed && player.lastkey === "a") {
    player.velocity.x = -3
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 3
  }

  //Enemy

  enemy.velocity.x = 0
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -3
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 3
  }

  // collision

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    //console.log(" player hit");

    enemy.health -= 10
    document.getElementById("eHealthLock2").style.width = enemy.health + "%"
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    //console.log("Enemy-hit");

    player.health -= 10
    document.getElementById("pHealthLock2").style.width = player.health + "%"
  }
}

animate()

//player

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true
      player.lastkey = "d"
      break
    case "a":
      keys.a.pressed = true
      player.lastkey = "a"
      break
    case "w":
      player.velocity.y = -18
      break
    case " ":
      player.attack()
      break

    //Enemy

    case "ArrowRight":
      keys.ArrowRight.pressed = true
      enemy.lastkey = "ArrowRight"
      break
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true
      enemy.lastkey = "ArrowLeft"
      break
    case "ArrowUp":
      enemy.velocity.y = -18
      break
    case "ArrowDown":
      enemy.isAttacking = true
      break
  }
})

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false
      break
    case "a":
      keys.a.pressed = false
      break
  }

  //Enemy
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false
      break
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false
      break
  }
})
