import React from 'react'
import { Link } from 'react-router-dom'

const Carrito = (props) => {
    return (
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
                                props.compras.map(compra => (
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
                    <h2 className="d-flex justify-content-start">Total: ${props.total}</h2>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <Link to="/home" type="button" className="btn btn-light border">Cancelar</Link>
                        <button type="button" className="btn btn-light border" onClick={props.pagarCarrito}>Pagar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carrito