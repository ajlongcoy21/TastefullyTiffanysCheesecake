import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';

import HomePage from './components/mainPages/homePage';
import OrderPage from './components/mainPages/orderPage';
import CheesecakePage from './components/mainPages/cheesecakePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/TastefullyTiffanysCheesecakes" component={HomePage}/>
          <Route path="/TastefullyTiffanysCheesecakes/placeorder" component={OrderPage}/>
          <Route path="/TastefullyTiffanysCheesecakes/cheesecakes" component={CheesecakePage}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
