import React from 'react'
import { useFirebaseApp } from 'reactfire'
import { Link } from 'react-router-dom'

const Menu = () => {

    const firebase = useFirebaseApp()

    const logout = () => {
        firebase.auth().signOut()
    }

    return (
        <Link onClick={logout}>
            <p >Cerrar sesion</p>
        </Link>
    )
}
export default Menu