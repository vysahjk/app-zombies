import moment from 'moment'
import fetch from 'isomorphic-fetch'

export const setMembre = (membre) => async (dispatch, getState) => {

  dispatch({
    type: 'SET_MEMBRE',
    payload: membre
  })

  dispatch({
    type: 'SET_VIE_PLAYER',
    payload: 100
  })

  dispatch({
    type: 'SET_TIME_INIT',
    payload: moment().unix()
  })

}

export const setUsername = (username) => (dispatch, getState) => {

  dispatch({
    type: 'SET_USERNAME',
    payload: username
  })

}

export const setViePLayer = (vie) => (dispatch, getState) => {

  dispatch({
    type: 'SET_VIE_PLAYER',
    payload: vie
  })

}



export const setZombiesMorts = (zombies) => (dispatch, getState) => {

  dispatch({
    type: "SET_ZOMBIES_MORTS",
    payload: zombies
  })

}

export const partieTermine = (time) => (dispatch, getState) => {

  dispatch({
    type: "SET_TIME_PLAYER",
    payload: time
  })

  dispatch({
    type: "SET_TERMINER",
    payload: true
  })

  setTimeout(() => {
    window.location.href = '/terminer'
  }, 1000)

}

export const partieGagner = (time) => (dispatch, getState) => {

  dispatch({
    type: "SET_TIME_PLAYER",
    payload: time
  })

  dispatch({
    type: "SET_GAGNER",
    payload: true
  })

  setTimeout(()=>{
    window.location.href = '/gagner'
  }, 1000)

}

export const setTermine = (isFini) => (dispatch, getState) => {

  dispatch({
    type: "SET_TERMINE",
    payload: isFini
  })

}

export const enregistrerPartie = (partie) => (dispatch, getState) => {

  fetch("http://localhost:8100/api/partie/save", {
    method: "POST",
    mode: "cors",
    headers: new Headers({
     'Content-Type' : 'application/json'
    }),
    body: JSON.stringify(partie)
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)

      dispatch({
        type: 'SET_USERNAME',
        payload: ""
      })

      dispatch({
        type: "SET_TERMINER",
        payload: false
      })

    })
    .catch(err => {
      console.log(err)
      console.log(partie)

    })

}


export const getAllScores = () => (dispatch, getState) => {

  fetch("http://localhost:8100/api/partie/scores", {
    method: "GET",
    mode: "cors",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)

      dispatch({
        type: "SET_SCORES",
        payload: data
      })

      dispatch({
        type: 'SET_USERNAME',
        payload: ""
      })

      dispatch({
        type: "SET_TERMINER",
        payload: false
      })

      dispatch({
        type: "SET_GAGNER",
        payload: false
      })

      console.log(getState().app.terminer)
      console.log(getState().app.gagner)
      console.log(getState().app.username ? true : false)
    })

}