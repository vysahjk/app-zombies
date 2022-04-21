import Matter from 'matter-js'

export class Ground{
  constructor(x, y, w, h, world){
    const options = {
      friction: 1,
      restitution: 0,
      collisionFilter: {
        group: 0,
        collidesWith: [0, 1]
      },
      label: "Ground"
    }
    this.w = w
    this.h = h
    this.body = Matter.Bodies.rectangle(x, y, w, h, options);
    this.body.isStatic = true;
    Matter.World.add(world, this.body)
    // Matter.Body.setMass(ground.body, 100)
  }
  

  show(p, bg_ground){
    const pos = this.body.position
    p.push();
    p.translate(pos.x, pos.y)
    Matter.Body.setAngularVelocity(this.body, 0)
    p.imageMode(p.CENTER);
    // console.log(this.body)
    // image(animation[0], 0, 0, 34, 55)
    p.image(bg_ground, 0, 0, this.w, this.h)
    p.pop();
  }
}