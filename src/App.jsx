import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TripForm from "./components/TripForm";
import TripDetails from "./components/TripDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={TripForm} />
          <Route path="/trip/:id" component={TripDetails} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;