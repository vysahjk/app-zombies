import Matter from 'matter-js'

export class SlingShot {
  constructor(bodyA, bodyB, stifness, length, world){
    this.sling = Matter.Constraint.create({
      bodyA: bodyA,
      bodyB: bodyB,
      stiffness: stifness,
      length: length
    })
    Matter.World.add(world, this.sling)
  }

  fly(world){
    this.sling.bodyB = null
    Matter.World.remove(world, this.sling)
  }

  show(p){
    if(this.sling.bodyB){
      p.stroke(255)
      const posA = this.sling.bodyA.position;
      const posB = this.sling.bodyB.position;
      p.line(posA.x, posA.y, posB.x, posB.y)
    }
  }

  attached(body){
    this.sling.bodyB = body
  }
}