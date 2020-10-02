import React, { useState } from 'react';
import Login from './Login'
import Home from './Home'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import "./App.css"
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/font-awesome/css/font-awesome.css'
import { useFirebaseApp } from 'reactfire'

export default function App() {

    const [error, setError] = useState(false)
    const [hola, setHola] = useState("hola mundo")
    const firebase = useFirebaseApp()

    //console.log(hola);

    async function login(values) {
        try {
            await firebase.auth().signInWithEmailAndPassword(values.email, values.password)
            setError(false)
            window.location.replace("/home")
            // props.history.replace('/home')
        } catch (error) {
            setError(true)
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error: " + error.code + " - " + error.message);
            console.log(errorCode + " " + errorMessage);
        }
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Login login={login} error={error} setHola={setHola} hola={hola} />
                </Route>
                {/* <Route exact path='/' component={Login} /> */}
                <Route exact path='/home' component={Home} />
            </Switch>
        </Router>
    )
}