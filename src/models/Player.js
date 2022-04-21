import Matter from 'matter-js'

export class Player {
  constructor(x, y, r, world, bg_player, hero){
    
    const options = {
      friction: 1,
      restitution : 0,
      collisionFilter: {
        group: 1,
        collidesWith: [0, 1]
      },
      label: hero === "hero" ? "Hero" : "Player"
    }
    //creation Body Player
    this.body = Matter.Bodies.circle(x,y, r, options);
    
    //Properties Body
    this.t = 0
    this.r = r;
    this.mass = 20
    this.marcher = false
    this.animation = []
    this.newPosition = 0
    this.position = this.body.position
    
    //Animation sprite zombie
    for (let i = 0; i < 14; i++) {
      let pix = bg_player.get(i * 34, 0, 34, 55)
      this.animation.push(pix)
    }

    // Adding to the world Matter
    Matter.Body.setAngularVelocity(this.body, 0)
    Matter.Body.setMass(this.body, this.mass)
    Matter.World.add(world, this.body)
    
    
  }

  removeBody(world){
    Matter.World.remove(world, this.body)
    this.body = null
  }
  
  show(p, direction) {
    p.push();
    p.translate(this.position.x, this.position.y)
    p.imageMode(p.CENTER);
    if (direction < 0) {
      p.scale(-1, 1)
    } else {
      p.scale(1, 1)
    }
    p.image(this.animation[0], 0, -12, 34, 55)
    p.pop();
  }
  
  walk(p, left){
    this.sauter = false
    const pos = this.body.position
    this.marcher = p.floor(this.body.position.x) === p.floor(this.body.positionPrev.x)
    if (p.floor(this.body.position.x) === p.floor(this.body.positionPrev.x)){
      this.t += 0.5 + (p.cos(p.floor(pos.x)) ^ 2 / 360)
    }else{
      this.t = 0
    }
    p.push();
    p.translate(pos.x, pos.y)
    // angleMode(DEGREES);
    Matter.Body.setAngularVelocity(this.body, 0)
    p.imageMode(p.CENTER);
    if(left < 0){
      p.scale(-1, 1)
    }else{
      p.scale(1, 1)
    }
    p.image(this.animation[p.floor(this.t) % this.animation.length], 0, -12, 34, 55)
    p.pop();

  }

  jump(p, left){
    this.sauter = true
    const pos = this.body.position
    p.push();
    p.translate(pos.x, pos.y)
    p.angleMode(p.DEGREES);
    Matter.Body.setAngularVelocity(this.body, 0)

    p.imageMode(p.CENTER);
    if (left) {
      p.scale(-1, 1)
    } else {
      p.scale(1, 1)
    }
    p.image(this.animation[1], 0, 0, 34, 55)
    p.pop();

  }

  shot(arme, force) {
    Matter.Body.applyForce(arme.body, { x: arme.body.position.x, y: arme.body.position.y }, { x: force, y: 0 })
  }

  isOffScreen(p) {
    return (this.body.position.y) > p.height + 100
  }

}