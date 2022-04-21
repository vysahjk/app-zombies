import React from 'react'
import styles from './Gagner.module.css'
import cx from 'classnames'
import { connect } from 'react-redux';
import moment from 'moment'
import { enregistrerPartie, setTermine } from '../actions';


class Gagner extends React.Component {

  state = {
    time: this.props.set_time
  }

  render() {
    return (
      <>
       {
          this.props.username && this.props.gagner ?
            <div>
              <h1 className={cx(styles.title, "title is-1 has-text-white")}> Félicitations {this.props.username} ....vous avez gagné!!!</h1>
              <div className={cx(styles.start_btn, "has-text-white")}>

                <div className={cx(styles.list, "container")}>
                  <div className={styles.margin}>
                    <a href="/">
                      <button className="button is-light is-large" onClick={e => this.props.enregistrerPartie()}>Retourner</button>
                    </a>
                  </div>
                </div>

              </div>

              <div className="has-text-white">

                <div className={cx(styles.rules, styles.white)}>
                  <p className="is-size-3 has-text-centered">Score </p>
                  <br />
                  <p><strong className="has-text-success">Username:</strong> {this.props.username}</p>
                  <p><strong className="has-text-success">Vie:</strong> {this.props.vie_player}</p>
                  <p><strong className="has-text-success">Zombies morts:</strong> {this.props.zombies_morts}</p>
                  <p><strong className="has-text-success">Time:</strong> {moment.unix(this.props.time_player).format('mm:ss')}</p>
                </div>

              </div>
            </div>
            
            :
            <div>
              { window.location.href = '/' }
            </div>
       } 
        
      </>
    )
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
    gagner: state.app.gagner
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    enregistrerPartie: () => dispatch(enregistrerPartie()),
    setTermine: (isFini) => dispatch(setTermine(isFini))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gagner)