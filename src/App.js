import React from 'react';
import styles from './App.module.css';
import Jeu from './Jeu/Jeu';
import Home from './Home/Home';
import Terminer from './Terminer/Terminer';
import Gagner from './Gagner/Gagner';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className={styles.App}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/jeu" component={Jeu} />
          <Route exact path="/gagner" component={Gagner} />
          <Route exact path="/terminer" component={Terminer} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
