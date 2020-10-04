import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = (props) => {
    return (
        <nav className="container contenido-articulo navbar navbar-light bg-light">
            <h1 className="navbar-brand">La Bodega</h1>
            <ul className="nav justify-content-end">
                <Link to="/home" className="nav-link">
                    <i className="fa fa-th" aria-hidden="true"></i>
                </Link>
                <Link to="/carrito" className="nav-link" onClick={props.getCarrito}>
                    <i className="fa fa-cart-arrow-down"></i><span className="badge badge-danger">{props.compras.length !== 0 ? props.compras.length : ''}</span>
                </Link>
                <Link to="/home" className="nav-link">
                    <i className="fa fa-inbox" aria-hidden="true"></i>
                </Link>
                <Link to="/#" className="nav-link" onClick={props.logout}>
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                </Link>
            </ul>
        </nav>
    )
}

export default Navbar