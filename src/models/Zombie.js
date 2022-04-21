import Matter from 'matter-js'

export class Zombie {
  constructor(p, x, y, w, h, world, zombies){
    
    const options = {
      friction: 0.1,
      restitution: 0,
      label: "Bob"
    }
    
    // Creation body in world matter
    this.body = Matter.Bodies.rectangle(x, y, w, h, options);
    
    // Properties
    this.animation_zombie = []
    this.w = w;
    this.h = h;
    this.t = 0
    this.direction = 0
    this.mass = 10
    Matter.Body.setMass(this.body, this.mass)
    Matter.Body.setAngularVelocity(this.body, 0.0)

    
    //Animation sprite zombie
    for (let i = 0; i < 10; i++) {
      let zom = zombies.get(i * 65, 0, 65, 92)
      this.animation_zombie.push(zom)
    }
    
    // Adding to the world Matter
    Matter.World.add(world, this.body)
  }

  show(p) {
    const pos = this.body.position
    p.push();
    p.translate(pos.x, pos.y)
    p.angleMode(p.DEGREES);
    p.imageMode(p.CENTER);
    p.image(this.animation_zombie[0], 0, 0, 65, 92)
    p.pop();
  }
  
  walk(p, hero){
    if(this.body.position.x - hero.body.position.x > 0){
      this.direction = -1
    }else{
      this.direction = 1
    }
    if (p.floor(this.body.position.x) === p.floor(this.body.positionPrev.x)) {
      this.t += 0.2 + (p.cos(p.floor(this.body.position.x)) ^ 2 / 360)
    } else {
      this.t = 0
    }
    
    p.push();
    p.translate(this.body.position.x, this.body.position.y)
    Matter.Body.translate(this.body, { x: this.direction, y: 0 });
    p.imageMode(p.CENTER);
    Matter.Body.setAngularVelocity(this.body, 0.0)
    
    if (this.direction < 0) {
      p.scale(-1, 1)
    } else {
      p.scale(1, 1)
    }
    
    p.image(this.animation_zombie[p.floor(this.t) % this.animation_zombie.length], 0, 0, 65, 92)
    p.pop();
  }
  
  shot(arme, force) {
    
    Matter.Body.applyForce(this.arme.body, { x: this.arme.body.position.x, y: this.arme.body.position.y }, { x: force * this.direction, y : 0})
  }

  isOffScreen(p){
    return (this.body.position.y ) > p.height + 100
  }
}