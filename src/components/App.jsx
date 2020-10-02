import React from 'react'
import Login from './Login'
import Home from './Home'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import "./App.css"
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/font-awesome/css/font-awesome.css'

export default function App() {
    const hola = () => {
        console.log('hola mundo');
    }
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Login} />
                <Route exact path='/home' component={Home} />
            </Switch>
        </Router>
    )
}