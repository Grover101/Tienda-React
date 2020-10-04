import React from 'react'
import { Link } from 'react-router-dom'

const ProductoDetalle = (props) => {
    return (
        <div className="productos container contenido-articulo">
            <div className="row">
                <div className="col-sm-8 mt-3">
                    <h3>{props.product.Nombre}</h3>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-sm-7">
                    <img src={require("../img/" + props.product.id + ".jpg")} className="card-img-top border rounded float-left d-block" alt="..." />
                </div>
                <div className="col-sm-5">
                    <p className="card-text">Precio: ${props.product.Precio}</p>
                    <p className="card-text">Unidad disponible: {props.product.UnidadDisponible}</p>
                </div>
            </div>
            <div className="row ">
                <div className="col-3 mt-3 mb-3">
                    <Link to="/home" className="btn btn-light border ">Atras</Link>
                </div>
                <div className="col-9"></div>
            </div>
        </div>
    )
}

export default ProductoDetalle