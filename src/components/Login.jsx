import React, { useState } from 'react';
import 'firebase/auth'
import { useFirebaseApp, useUser } from 'reactfire'

const Login = (props) => {

  const inicialValues = {
    email: '',
    password: ''
  }
  const [values, setValues] = useState(inicialValues)

  const [error, setError] = useState(false)

  const firebase = useFirebaseApp()

  const user = useUser()

  async function login(values) {
    try {
      await firebase.auth().signInWithEmailAndPassword(values.email, values.password)
      setError(false)
      props.history.replace('/home')
    } catch (error) {
      setError(true)
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error: " + error.code + " - " + error.message);
      console.log(errorCode + " " + errorMessage);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmint = e => {
    e.preventDefault()
    console.log(values);
    login(values)
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
              error &&
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
        props.history.replace('/home')
      }
    </div>
  )
}

export default Login


