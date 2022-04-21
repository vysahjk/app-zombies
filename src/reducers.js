import initialState from './initialState.json'

const state_current = JSON.stringify(initialState)

export const reducers = (state = JSON.parse(state_current), action) => {

  switch (action.type) {

    case ("SET_MEMBRE"):
      return { ...state, membre: action.payload }

    case ("SET_USERNAME"):
      return { ...state, username: action.payload }

    case ("SET_VIE_PLAYER"):
      return { ...state, vie_player: action.payload }

    case ("SET_TIME_INIT"):
      return { ...state, timeinit: action.payload }

    case ("SET_TIME_PLAYER"):
      return { ...state, time_player: action.payload }

    case ("SET_ZOMBIES_MORTS"):
      return { ...state, zombies_morts: action.payload }

    case ("SET_SCORES"):
      return { ...state, scores: action.payload }

    case ("SET_TERMINER"):
      return { ...state, terminer: action.payload }

    case ("SET_GAGNER"):
      return { ...state, gagner: action.payload }

    
    default:
      return state
  }

}