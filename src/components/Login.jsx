import React, { useState } from 'react';
import 'firebase/auth'
import { useUser } from 'reactfire'

const Login = (props) => {

  const inicialValues = {
    email: '',
    password: ''
  }
  const [values, setValues] = useState(inicialValues)
  const user = useUser()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmint = e => {
    e.preventDefault()
    console.log(values);
    props.login(values)
  }

  return (
    <div className="login">
      {
        !user &&
        <div className="contenedor" >
          <form onSubmit={handleSubmint}>
            <h2 className="h2 mb-3 font-weight-normal">Inicia Sesión</h2>
            <div className="form-row">
              <div className="col-md-12 col-sm-8 mb-2">
                <label htmlFor="email">Correo electrónico:</label>
                <input type="email" className="form-control form-control-sm" name="email" required onChange={handleInputChange} />
              </div>
              <div className="col-md-12 col-sm-8 mb-2">
                <label htmlFor="password">Contraseña:</label>
                <input type="password" className="form-control form-control-sm" name="password" required onChange={handleInputChange} />
              </div>
            </div>
            {
              props.error &&
              <p className="color">Error en el incio de sesion</p>
            }
            <div className="text-center">
              <button className="btn btn-success" type="submit" >Ingresar</button>
            </div>
          </form>
        </div>
      }
      {
        user &&
        window.location.replace("/home")
      }
    </div>
  )
}

export default Login


