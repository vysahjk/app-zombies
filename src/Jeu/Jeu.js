import React, { Component } from 'react';
import styles from './Jeu.module.css';
import cx from 'classnames'
import { connect } from 'react-redux';
import moment from 'moment'

import { setMembre, setViePLayer, partieTermine, setZombiesMorts, setUsername, partieGagner, setTermine} from '../actions';
import io from 'socket.io-client'
import { Engine, Body, World, Events  } from 'matter-js'
import { Ground } from '../models/Ground'
import { Zombie } from '../models/Zombie'
import { Player } from '../models/Player'
import { Arme } from '../models/Arme'
import { SlingShot } from '../models/Slingshot'
import p5 from 'p5'

/** SOCKET.IO MULTIPLAYER */
const socket = io.connect('https://zombie.nibaldonoso.fr:4500')

/** CONSTANTS */
const FORCE_MARCHER = 4
const FORCE_JUMP = -1

/** VARIABLES */
let canvas
let bg, bg_ground
let engine, world
let grounds = [], grounds_level_1 = []
let enemys = [], bg_zombie
let hero = null, bg_player, players = []
let arme, slingShot, enemy_arme, enemy_slingShot
let IS_IN_AIRE = false
let zombies_morts = 0

class App extends Component {
  
  state = {
    username: "",
    name: "",
    zombies : 2,
    time: 0,
    time_player: 0,
    zombies_morts : 0
  }
  
  /** SKETCH JEU ZOMBIE */
  sketch = (p) => {
    
    /** FUNCTION PRELOAD IMAGES AVANT DE COMMENCER LE JEU*/
    p.preload = () => {
      bg = p.loadImage('images/BG.png')
      bg_ground = p.loadImage('images/ground.png')
      bg_zombie = p.loadImage('images/zombie.png')
      bg_player = p.loadImage('/images/boy.png')
    }
    
    /** FUCNTION SETUP CONDITIONES INITIALES */
    p.setup = () => {
    
      canvas = p.createCanvas(bg.width, bg.height)
      engine = Engine.create()
    

      world = engine.world
      world.gravity.y = 1
      
      for (let i = 0; i < 2; i++) {
        grounds[i] = new Ground(0 + (bg_ground.width -100) * i, p.height - 25, bg_ground.width, 50, world)
      }
      for(let i = 0; i< 3; i++){
        grounds_level_1[i] = new Ground(550 * i, p.random(640, 350), 300, 50, world);
      }

      for (let i = 0; i < 2; i++) {
        enemys[i] = new Zombie(p, i * 500, p.height - 55, 65, 92, world, bg_zombie);
        newArmeEnemy(enemys[i], 100)
      }
      
      
      
     

      socket.on('me', data => {
        if(hero){
          hero.removeBody(world)
        }
        
        hero = new Player( p.width/2, p.height - 100, 16, world, bg_player, "hero")
        Events.on(engine, 'collisionStart', (event) => {
          
          var pairs = event.pairs;
          for (let pair of pairs) {

            if ((pair.bodyA.label === "Ground") && (pair.bodyB.label === "Hero")){
              // console.log("On Ground")
              IS_IN_AIRE = false
            }

            if ((pair.bodyA.label === "Hero") && (pair.bodyB.label === "Arme")) {
              console.log("Ohh Touché")
              this.props.setViePLayer(this.props.vie_player - 1)
              // this.play("hero_oof")

            }
            
          }
        });

        Events.on(engine, 'collisionEnd', function (event) {

          // console.log(event.source.pairs)
          var pairs = event.pairs;
          for (let pair of pairs) {
            if ((pair.bodyA.label === "Ground") && (pair.bodyB.label === "Hero")) {
              // console.log("On Air")
              IS_IN_AIRE = true
            }
          }
        });
      })
      
      socket.on('set_new_user', data => {
        players.push(new Player(p.width / 2, p.height - 100, 16, world, bg_player))
      })
    
      Engine.run(engine)
      
      socket.on('setMarcher', marche)

    }
    
    /** FUNCTION DRAW, FRAME RATE 60 fps */
    p.draw = () => {  
      p.frameRate(60)
      hero ? canvas.translate(p.width/2-hero.body.position.x, 0) : canvas.translate(0,0)
      p.background(bg)

      for (let ground of grounds) {
        ground.show(p, bg_ground);
      }
      
      for(let ground_level1 of grounds_level_1){
        ground_level1.show(p, bg_ground);
      }
      
      for(let player of players){
        player.show(p)
      }
      
      
      if(hero){

        if (this.props.vie_player <= 0) {
          if (p.frameCount % 60 === 0) {
            this.props.setTermine(true)
            this.props.setZombiesMorts(this.state.zombies_morts)
            this.props.partieTermine(this.state.time_player)
          }
        }

        if (hero.isOffScreen(p)) {
          World.remove(world, hero.body)
          if (p.frameCount % 60 === 0) {
            this.props.setTermine(true)
            this.props.setZombiesMorts(this.state.zombies_morts)
            this.props.partieTermine(this.state.time_player)
          }
        }
        
        this.setState({ time_player : this.state.time - this.props.timeinit})
        if(this.state.zombies !== 0){
          if(p.frameCount % 60 === 0){
            this.setState({ time: moment().unix() })
          }

          if (p.frameCount % 360 === 0){  
            enemys.push(new Zombie(p, -200, p.height - 550, 65, 92, world, bg_zombie));
          }
        }else{
          if (p.frameCount % 60 === 0) {
            this.props.setTermine(true)
            this.props.partieGagner(this.state.time_player)
          }
        }

        // socket.emit('marcher', { x: p.round(hero.body.position.x, 0), y: p.round(hero.body.position.y, 0) })
        

        // CONTROL ENEMY ZOMBIE
        this.setState({ zombies : enemys.length})
        
        enemys.forEach((enemy, index, array) => {

          enemy.walk(p, hero)
          
          if(enemy.arme){
            enemy.arme.show(p)
          }


          if(p.frameCount % 60 === 0){
          
            this.play("zombie_amb")
            
            if (distance(p, hero.body, enemy.body) < 2000){
              
              if(hero.body.position.x - enemy.body.position.x < 0){
                newArmeEnemy(enemy, -100)
                enemy_slingShot.show(p)
                shootingEnemy(enemy, enemy_arme, enemy_slingShot, 0.5)
              } else {
                newArmeEnemy(enemy, 100)
                enemy_slingShot.show(p)
                shootingEnemy(enemy, enemy_arme, enemy_slingShot, 0.5)
              }
            }else{
              
            }
          }

            // Delete Enemy if isOffScreen
            deleteBody(enemy, index)
            this.setState({ zombies_morts: zombies_morts})
        })
            
        

        if(p.keyIsPressed){
          
          // Key D clavier
          if (p.keyIsDown(68)) {
            walking(1)
            this.pressed("btn_p",false)
            this.pressed("btn_o", false)
          } else{
            // Key Q clavier
            if (p.keyIsDown(81)) {
              walking(-1)
              this.pressed("btn_p", false)
              this.pressed("btn_o", false)
            }else{
              hero.show(p);

            }
          }
          
          
          
          // Key Z clavier
          if (p.keyIsDown(90)) {            
            if(!IS_IN_AIRE){
              this.play("jump")
              // hero.show(p);
              Body.applyForce(hero.body, { x: hero.body.position.x, y: hero.body.position.y }, { x: 0, y: FORCE_JUMP })    
            }
          }
  
          // Key P clavier
          if (p.keyIsDown(80)) {
            // hero.show(p);
            slingShot.show(p)
            shooting(hero, arme, slingShot, 0.1)
            this.pressed("btn_p",true)
          } 


          
          // Key O clavier
          if (p.keyIsDown(79)) {
            slingShot.show(p)
            shooting(hero, arme, slingShot, -0.1)
            this.pressed("btn_o", true)
          } 
           
        }else{
          
          this.pressed("btn_p",false)
          this.pressed("btn_o", false)
          hero.show(p);

        }
         
      }
    
    }


    p.keyPressed = () => {
      if (p.key === "z") {
        
      }else if( p.key === "p"){
        this.play("melee")

        newArme(100)

      } else if (p.key === "o") {
        this.play("melee")
        newArme(-100)  
      }
       
    }   


    /**
     * New Arme
     * @param {*} direction 
     */
    function newArme(direction){
      arme = new Arme(hero.body.position.x + direction, hero.body.position.y, false, world)
      slingShot = new SlingShot(hero.body, arme.body, 0.0001, 40, world)

    }

    /**
     * New Arme Enemy
     * @param {*} direction 
     */
    function newArmeEnemy(enemy, direction) {
      enemy.arme = new Arme(enemy.body.position.x + direction, enemy.body.position.y, false, world)
      enemy_slingShot = new SlingShot(enemy.body, enemy.arme.body, 0.0001, 100, world)

    }

    /**
     * 
     * @param {*} body 
     * @param {*} arme 
     * @param {*} sling 
     * @param {*} direction 
     */
    function shooting(body, arme, sling, force){
      //slingShot.show(p)
      
      if (arme) {
        arme.show(p)
      }

      body.shot(arme, force)
      setTimeout(function () {
        sling.fly(world)
        World.remove(world, arme.body)
        arme = null
      }, 200)
    }

    /**
     * 
     * @param {*} body 
     * @param {*} arme 
     * @param {*} sling 
     * @param {*} direction 
     */
    function shootingEnemy(body, arme, sling, force) {
      //slingShot.show(p)

      if (arme) {
        arme.show(p)
      }

      body.shot(arme, force)
      setTimeout(function () {
        sling.fly(world)
        World.remove(world, body.arme.body)
        body.arme = null
      }, 300)
    }


    /**
     * Walking Hero
     * @param {*} direction 
     */
    function walking(direction){
      hero.walk(p, direction)
      Body.translate(hero.body, { x: direction*FORCE_MARCHER, y: 0 });
      
    }

    function marche (marche) {
      if (marche) {
        
        for (let player of players) {
          Body.setPosition(player.body, { x: marche.x , y: marche.y });           
        }
      
      } else {
        
      }
    }

    function distance(p, bodyA, bodyB){
      let positionA = p.createVector(bodyA.position.x, bodyA.position.y)
      let positionB = p.createVector(bodyB.position.x, bodyB.position.y)
      
      let dist = p5.Vector.sub(positionA, positionB).magSq()
      return p.round(dist / 100, 2)


    }

    function deleteBody(enemy, index){
      if(enemy.isOffScreen(p)){
        World.remove(world, enemy.body)
        enemys.splice(index, 1)
        zombies_morts = zombies_morts + 1
      }
    }

   

  }





  /**
   * FUNCTION INIT P5 ET MAIN AUDIO 
   */
  componentDidMount = () => {
    new p5(this.sketch, document.querySelector('#sketch-holder'))
    let main_audio = document.querySelector('#main_theme')
    main_audio.volume = 0.1
    main_audio.play()
    
    setTimeout(()=>{
      this.props.addMembre(this.state.name)
      socket.emit('new_user', this.state.name)
    }, 2000)

    
  }
  
  /**
   * FUNCTION PLAY SOUND
   */
  play = (type) => {
    let audio_jump = document.querySelector('#jump')
    let audio_melee = document.querySelector('#melee')
    let audio_zombie_amb = document.querySelector('#zombie_amb')
    let audio_hero_oof = document.querySelector('#hero_oof')

   
    if(type === "jump"){
      audio_jump.volume = 0.1
      audio_jump.play()
    }

    if (type === "melee") {
      audio_melee.volume = 0.6
      audio_melee.play()
    }

    if (type === "zombie_amb") {
      audio_zombie_amb.volume = 0
      audio_zombie_amb.play()
    }

    if (type === "hero_oof") {
      audio_hero_oof.volume = 0
      audio_hero_oof.play()
    }
  }

  pressed = (btn, pressed) => {
    let button = document.querySelector(`#${btn}`)
    if(button){
      if(pressed){
        button.classList.add('is-danger')
        button.classList.remove('is-primary')
      }else{
        button.classList.add('is-primary')
        button.classList.remove('is-danger')
      }
    }
  }

  handleClick = () => {
    this.props.addMembre(this.state.name)
    socket.emit('new_user', this.state.name)
  }

  render(){
  return (
    <>
    <div className={styles.jeu}>
     
      <div className="column">
        <audio id="main_theme" src="sound/main_sound.mp4" loop></audio>
        <audio id="jump" src="sound/jump_10.wav"></audio>
        <audio id="melee" src="sound/melee_sound.wav"></audio>
        <audio id="zombie_amb" src="sound/zombie_amb.wav"></audio>
        <audio id="hero_oof" src="sound/oof.mp4"></audio>
      </div>

      <div className={cx(styles.board, "column is-12")}>
        <button id="username" className={cx(styles.start, "button colmun is-primary")} onClick={this.handleClick}>Restart</button>
        
        <button id="btn_o" className={cx(styles.btn_o, "button is-primary has-text-dark")}>
          <span className="icon">
            <i className="fas fa-arrow-left"></i>
          </span>
          <p className="title is-6 is-marginless">O</p>
        </button>
        <button id="btn_p" className={cx(styles.btn_p, "button is-primary has-text-dark")}>
          <p className="title is-6 is-marginless">P</p>
          <span className="icon">
            <i className="fas fa-arrow-right"></i>
          </span>
        </button>

        <button id="btn_z" className={cx(styles.btn_z, "button is-primary has-text-dark")}>
          <p className="title is-6 is-marginless">Z</p>
          <span className="icon">
            <i className="fas fa-arrow-up"></i>
          </span>
        </button>
        <button id="btn_q" className={cx(styles.btn_q, "button is-primary has-text-dark")}>
          <span className="icon">
            <i className="fas fa-arrow-left"></i>
          </span>
          <p className="title is-6 is-marginless">Q</p>
        </button>
        <button id="btn_d" className={cx(styles.btn_d, "button is-primary has-text-dark")}>
          <p className="title is-6 is-marginless">D</p>
          <span className="icon">
            <i className="fas fa-arrow-right"></i>
          </span>
        </button>

        <button id="btn_punch" className={cx(styles.btn_punch, "button is-dark has-text-white")}>ATTAQUE</button>
        <button id="btn_zombies" className={cx(styles.btn_zombies, "button is-dark has-text-white subtitle")}>ZOMBIES {this.state.zombies}</button>
        <button id="btn_zombies" className={cx(styles.btn_zombies_morts, "button is-dark has-text-white subtitle")}>ZOMBIES MORTS {this.state.zombies_morts}</button>

        

      </div>
  
    </div>

    <div className={cx(styles.vie, "container title has-text-white")}>
        <div>
          Vie: {this.props.vie_player} / {this.props.vie_total} 
        </div>
    </div>


      <div className={cx(styles.timeinit, "container title has-text-white")}>
        <div>
          Time Start: {moment.unix(this.props.timeinit).format("HH:mm:ss")}
        </div>
      </div>
      <div className={cx(styles.time, "container title has-text-white")}>
        <div>
          Time: {moment.unix(this.state.time_player).format("mm:ss")}
        </div>
      </div>




    </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    membre: state.app.membre,
    vie_player: state.app.vie_player,
    vie_total: state.app.vie_total,
    time_player: state.app.time_player,
    timeinit: state.app.timeinit,
    zombies_morts: state.app.zombies_morts,
    username: state.app.username,
    terminer: state.app.terminer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMembre : (membre) => dispatch(setMembre(membre)),
    setusername: (username) => dispatch(setUsername(username)),
    setViePLayer: (vie) => dispatch(setViePLayer(vie)),
    partieTermine: (time_player) => dispatch(partieTermine(time_player)),
    setZombiesMorts: (zombies_morts) => dispatch(setZombiesMorts(zombies_morts)),
    partieGagner: (time_player) => dispatch(partieGagner(time_player)),
    setTermine : (isFini) => dispatch(setTermine(isFini))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
