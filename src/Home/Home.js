import React from 'react';
import styles from './Home.module.css';
import cx from 'classnames'
import { connect } from 'react-redux';
import { setUsername, getAllScores} from '../actions';
import moment from 'moment'

class Home extends React.Component {

  state = {
    username : ""
  }

  componentDidMount = () => {
    this.props.getScores()
  }

    render() {
        return (
          <>
            <div className={cx(styles.username, styles.white, "container")}>
              <p className="is-size-3">Username: </p>
              <br/>
              <input className="input is-medium" type="text" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
              <div className={cx(styles.margin, "columns is-centered")}>
                <a href="/jeu/twoplayer">
                  <button className="button is-light is-medium" disabled>S'inscrire</button>
                </a>
              </div>
            </div>
            <h1 className={cx(styles.title,  "title is-1 has-text-white")}>ZOMBIES RUNNER</h1>
            <div className={cx(styles.start_btn, "has-text-white container")}>
                <p className="is-size-3 has-text-centered">Start Game</p>
                <br />
              <div className={cx(styles.list, "container")}>
                <div className={cx(styles.margin, 'columns is-centered')}>

                  <a href="/jeu">
                    <button className="button is-light is-medium" onClick={e => this.props.setUsername(this.state.username)}>One Player</button>
                  </a>
                </div>
                <div className={cx(styles.margin, "columns is-centered")}>
                  <a href="/jeu/twoplayer">
                    <button className="button is-light is-medium" disabled>Two Player</button>              
                  </a>
                </div>
              </div>
            </div>

                <div className={cx(styles.rules, styles.white)}>
              <p className="is-size-3 has-text-centered"> Instructions </p>
              <br />
              <p><li>Le but du jeu est de survivre</li></p>
              <p><li>Les Zombies arrivent par vague</li></p>
              <p><li>Pour tuer un Zombie vous devez le faire tomber</li></p>
                </div>
                <div className={cx(styles.key, styles.white)}>
                    <button className={cx(styles.key_z, "button is-light is-medium")}>Z</button>
                    <br/>
                    <button className="button is-light is-medium">Q</button>
                    <button className="button is-light is-medium">S</button>
                    <button className="button is-light is-medium">D</button>

                    <button className={cx(styles.key_o, "button is-light is-medium")}>O</button>
                    <button className="button is-light is-medium">P</button>
                </div>

            <div className={cx(styles.scores, styles.white)}>
              <p className="is-size-3 has-text-centered">Best Scores </p>
              <br />
              <table className="table has-background-dark has-text-white">
                <thead>
                  <tr>
                    <th className="has-text-centered"><strong className="has-text-success">Pos.</strong></th>
                    <th className="has-text-centered"><strong className="has-text-success">Username</strong></th>
                    <th className="has-text-centered"><strong className="has-text-success">Vie</strong></th>
                    <th className="has-text-centered"><strong className="has-text-success">Zombies_morts</strong></th>
                    <th className="has-text-centered"><strong className="has-text-success">Time</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.scores.map((item, key) => {
                      return (
                        <tr key={key}>
                          <th className="has-text-white">{key + 1}</th>
                          <td>{item.username}</td>
                          <td>{item.vie}</td>
                          <td>{item.zombies_morts}</td>
                          <td>{moment.unix(item.time).format('mm:ss')}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              
            </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    scores: state.app.scores
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUsername: (username) => dispatch(setUsername(username)),
    getScores : () => dispatch(getAllScores())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home)
