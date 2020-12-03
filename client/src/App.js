import React from "react"
import Home from "./Views/Home"
import ChatRoom from "./Views/ChatRoom"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/chat">
          <ChatRoom />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
