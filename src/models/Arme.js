import Matter from 'matter-js'

export class Arme {
  constructor(x, y, statique, world) {
    const options = {
      friction: 0,
      label: "Arme"
    }
    this.r = 20
    this.body = Matter.Bodies.circle(x, y, this.r, options);
    this.body.isStatic = statique
    Matter.Body.setMass(this.body, 10)
    Matter.World.add(world, this.body)

  }

  show(p) {
    const pos = this.body.position
    p.push();
    p.translate(pos.x, pos.y)
    p.fill(255)
    p.rectMode(p.CENTER);
    p.circle(0, 0, this.r)
    p.pop();
  }

}