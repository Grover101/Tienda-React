import React, { useEffect, useState } from 'react'

// componentes
import Login from './Login'
import Navbar from './Navbar'
import Carrito from './Carrito'
import ProductDetalle from './ProductoDetalle'

//firebase
import 'firebase/firestore'
import { useFirebaseApp, useUser } from 'reactfire'
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom'

// estilos
import "./App.css"
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/font-awesome/css/font-awesome.css'


export default function App() {

    const firebase = useFirebaseApp()
    const user = useUser()
    const db = firebase.firestore()

    // states
    const [error, setError] = useState(false)
    const [productos, setProductos] = useState([])
    const [product, setProducto] = useState({})
    const [compras, setCompras] = useState([])
    const [cantidad, setCantidad] = useState(0)
    const [total, setTotal] = useState(0)
    const [busquedaText, setBusquedaText] = useState("")
    const [busqueda, setBusqueda] = useState([])


    async function login(values) {
        try {
            await firebase.auth().signInWithEmailAndPassword(values.email, values.password)
            setError(false)
        } catch (error) {
            setError(true)
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error: " + error.code + " - " + error.message);
            console.log(errorCode + " " + errorMessage);
        }
    }

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

    const logout = async () => {
        await firebase.auth().signOut()
        window.location.replace("/")
    }

    const agregar = async (compra) => {
        const add = { Nombre: compra.Nombre, Subtotal: cantidad * compra.Precio, Unidad: cantidad, Foto: compra.id }
        await db.collection('Usuario/' + user.email + '/Carrito').doc().set(add)
        getCarrito()
        const actualizar = { Nombre: compra.Nombre, Precio: compra.Precio, UnidadDisponible: compra.UnidadDisponible - cantidad }
        await db.collection('Productos/').doc(compra.id).update(actualizar)
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
        window.location.replace("/home")
        // console.log('productos pagados');
    }

    useEffect(() => {
        getProductos()
    });

    return (
        <Router>
            <div className="main">
                {
                    user &&
                    <Navbar
                        compras={compras}
                        logout={logout}
                        getCarrito={getCarrito}
                    />
                }
                <Switch>
                    <Route exact path="/">
                        <Login login={login} error={error} />
                    </Route>
                    <Route exact path='/home'>
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
                                                                    <button className="btn btn-warning btn-sm" onClick={() => { agregar(producto) }} >Añadir</button>
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
                                                                    <button className="btn btn-warning btn-sm" onClick={() => { agregar(busc) }} >Añadir</button>
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
                    </Route>
                    <Route path="/carrito">
                        {
                            compras.length > 0 &&
                            <Carrito
                                compras={compras}
                                total={total}
                                pagarCarrito={pagarCarrito}
                            />
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
                            <ProductDetalle
                                product={product}
                            />
                        }
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}