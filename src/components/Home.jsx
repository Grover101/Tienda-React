import React, { useEffect, useState } from 'react'
import { useFirebaseApp, useUser } from 'reactfire'
import 'firebase/firestore'
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom'

const Home = (props) => {
    const firebase = useFirebaseApp()
    const user = useUser()

    const db = firebase.firestore();

    const [productos, setProductos] = useState([])
    const [product, setProducto] = useState({})
    const [compras, setCompras] = useState([])
    const [cantidad, setCantidad] = useState(0)
    const [total, setTotal] = useState(0)
    const [busquedaText, setBusquedaText] = useState("")
    const [busqueda, setBusqueda] = useState([])

    const getProductos = async () => {
        await db.collection('Productos').onSnapshot((querySnapshot) => {
            const docs = []
            querySnapshot.forEach(doc => {
                docs.push({ ...doc.data(), id: doc.id })
            })
            // console.log(docs);
            setProductos(docs)
        })
    }

    const getCarrito = async () => {
        await db.collection('Usuario/' + user.email + '/Carrito').onSnapshot((querySnapshot) => {
            const com = []
            let cantidad = 0
            querySnapshot.forEach(compra => {
                com.push({ ...compra.data(), id: compra.id })
                cantidad = cantidad + compra.data().Subtotal
            })
            setCompras(com)
            setTotal(cantidad)
        })
    }

    const logout = () => {
        firebase.auth().signOut()
        window.location.replace("/")
    }

    const aniadir = async (compra) => {
        getCarrito()
        const add = { Nombre: compra.Nombre, Subtotal: cantidad * compra.Precio, Unidad: cantidad, Foto: compra.id }
        await db.collection('Usuario/' + user.email + '/Carrito').doc().set(add)
        // const actualizar = { Nombre: compra.Nombre, Precio: compra.Precio, UnidadDisponible: compra.UnidadDisponible - cantidad }
        // await db.collection('Productos').doc(compra.id).update(actualizar)
        setBusqueda([])
        setBusquedaText("")
        // console.log('agregado al carrito de compras');
    }

    const buscar = (e) => {
        setBusquedaText(e.target.value)
        const aux = []
        productos.forEach(producto => {
            if (producto.id.indexOf(e.target.value) >= 0)
                aux.push(producto)
        })
        // console.log(aux);
        setBusqueda(aux)
    }

    const pagarCarrito = async () => {
        await compras.forEach(compra => {
            db.collection('Usuario/' + user.email + '/Carrito').doc(compra.id).delete()
        })
        // console.log('productos pagados');
    }

    useEffect(() => {
        getProductos()
    });

    return (
        <Router>
            <div className="main">
                <nav className="container contenido-articulo navbar navbar-light bg-light">
                    <h1 className="navbar-brand">La Bodega</h1>
                    <ul className="nav justify-content-end">
                        <Link to="/home" className="nav-link">
                            <i className="fa fa-th" aria-hidden="true"></i>
                        </Link>
                        <Link to="/carrito" className="nav-link" onClick={getCarrito}>
                            <i className="fa fa-cart-arrow-down"></i><span className="badge badge-danger">{compras.length !== 0 ? compras.length : ''}</span>
                        </Link>
                        <Link to="/home" className="nav-link">
                            <i className="fa fa-inbox" aria-hidden="true"></i>
                        </Link>
                        <Link to="/logout" className="nav-link" onClick={logout}>
                            <i className="fa fa-sign-out" ></i>
                        </Link>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/home" >
                        {
                            user &&
                            <div className="productos container-sm">
                                <div className="row">
                                    <div className="col-sm-8 mt-4">
                                        <h3>Catalogo de Productos</h3>
                                    </div>
                                    <div className="col-sm-4 form-group mt-3">
                                        <label htmlFor="buscar">¿Que esta buscando?</label>
                                        <input type="text" id="buscar" className="form-control" onChange={buscar} placeholder="Buscar producto" />
                                    </div>
                                </div>
                                <div className="row">
                                    {
                                        busquedaText.length <= 0 &&
                                        productos.map(producto => (
                                            <div className="col-sm-3" key={producto.id} >
                                                <div className="card mt-3 mb-3">
                                                    <img src={require("../img/" + producto.id + ".jpg")} className="card-img-top rounded mx-auto d-block" alt="..." />
                                                    <div className="card-body">
                                                        <h4 className="card-title">{producto.Nombre}</h4>
                                                        <p className="card-text">Precio: ${producto.Precio}</p>
                                                        <p className="card-text">Unidad disponible: {producto.UnidadDisponible}</p>
                                                        <div className="row">
                                                            <div className="col-8">
                                                                <Link to={"/" + producto.id} className="btn btn-primary btn-sm" onClick={() => { setProducto(producto) }}>Ver Mas</Link>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="d-flex justify-content-end">
                                                                    <button className="btn btn-warning btn-sm" onClick={() => { aniadir(producto) }} >Añadir</button>
                                                                    <input type="number" className="form-control form-control-sm" min="0" placeholder="0" onChange={(ev) => { setCantidad(ev.target.value) }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        busquedaText.length >= 1 &&
                                        busqueda.map(busc => (
                                            <div className="col-sm-3" key={busc.id} >
                                                <div className="card mt-3 mb-3">
                                                    <img src={require("../img/" + busc.id + ".jpg")} className="card-img-top rounded mx-auto d-block" alt="..." />
                                                    <div className="card-body">
                                                        <h4 className="card-title">{busc.Nombre}</h4>
                                                        <p className="card-text">Precio: ${busc.Precio}</p>
                                                        <p className="card-text">Unidad disponible: {busc.UnidadDisponible}</p>
                                                        <div className="row">
                                                            <div className="col-8">
                                                                <Link to={"/" + busc.id} className="btn btn-primary btn-sm" onClick={() => { setProducto(busc) }}>Ver Mas</Link>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="d-flex justify-content-end">
                                                                    <button className="btn btn-warning btn-sm" onClick={() => { aniadir(busc) }} >Añadir</button>
                                                                    <input type="number" className="form-control form-control-sm" min="0" placeholder="0" onChange={(ev) => { setCantidad(ev.target.value) }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                        {
                            !user &&
                            props.history.replace('/')
                        }
                    </Route>
                    <Route path="/carrito">
                        {
                            compras.length > 0 &&
                            <div className="productos container contenido-articulo">
                                <div className="row">
                                    <div className="col-sm-8 mt-3">
                                        <h3>Carrito de compras</h3>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-6">
                                        <div className="card mb-3">
                                            <ul className="list-group list-group-flush">
                                                {
                                                    compras.map(compra => (
                                                        <li className="list-group-item" key={compra.id}>
                                                            <div className="row">
                                                                <div className="col-sm-4">
                                                                    <img src={require("../img/" + compra.Foto + ".jpg")} className="card-img-top border rounded float-left d-block" alt="..." />
                                                                </div>
                                                                <div className="col-sm-8">
                                                                    <p className="card-text">{compra.Nombre}</p>
                                                                    <p className="card-text">Unidades: {compra.Unidad}</p>
                                                                    <p className="card-text">Subtotal: ${compra.Subtotal}</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <h2 className="d-flex justify-content-start">Total: ${total}</h2>
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <Link to="/home" type="button" className="btn btn-light border">Cancelar</Link>
                                            <Link to="/home" type="button" className="btn btn-light border" onClick={pagarCarrito}>Pagar</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            compras.length === 0 &&
                            <div className="productos container contenido-articulo">
                                <div className="row">
                                    <div className="col-sm-12 d-flex justify-content-center">
                                        <h4>No hay lista de compras</h4>
                                    </div>
                                </div>
                            </div>
                        }
                    </Route>
                    <Route path={"/" + product.id}>
                        {
                            user &&
                            <div className="productos container contenido-articulo">
                                <div className="row">
                                    <div className="col-sm-8 mt-3">
                                        <h3>{product.Nombre}</h3>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-7">
                                        <img src={require("../img/" + product.id + ".jpg")} className="card-img-top border rounded float-left d-block" alt="..." />
                                    </div>
                                    <div className="col-sm-5">
                                        <p className="card-text">Precio: ${product.Precio}</p>
                                        <p className="card-text">Unidad disponible: {product.UnidadDisponible}</p>
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-3 mt-3 mb-3">
                                        <Link to="/home" className="btn btn-light border ">Atras</Link>
                                    </div>
                                    <div className="col-9"></div>
                                </div>
                            </div>
                        }
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default Home