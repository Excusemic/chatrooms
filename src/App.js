import React from "react"
import Home from "./Views/Home"
import ChatRoom from "./Views/ChatRoom"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

function App() {
  return (
    <Router>
      <Switch>
        <Home />

        <Route path="/chat">
          <ChatRoom />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
