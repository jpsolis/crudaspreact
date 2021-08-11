import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {
  const baseUrl="http://localhost/apiDbBoletas/api/MaeProductos";
  const [data, setData]=useState([]);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [productoSeleccionado, setProductoSeleccionado]=useState({
    iCodProducto:'',
    vDescripcion:'',
    iPrecio:''
})

const handleChange=e=>{
  const{name, value}=e.target;
  setProductoSeleccionado({
    ...productoSeleccionado,
    [name]: value
  });  
  console.log(productoSeleccionado);
}

const abrirCerrarModalInsertar=()=>{
  setModalInsertar(!modalInsertar);
}

const abrirCerrarModalEditar=()=>{
  setModalEditar(!modalEditar);
}

const abrirCerrarModalEliminar=()=>{
  setModalEliminar(!modalEliminar);
}

const peticionGet=async()=>{
  await axios.get(baseUrl)
  .then(response=>{
    setData(response.data);
  }).catch(error=>{
    console.log(error);
  })
}

const peticionPost=async()=>{
  delete productoSeleccionado.iCodProducto;
  productoSeleccionado.iPrecio = parseInt(productoSeleccionado.iPrecio);
  await axios.post(baseUrl, productoSeleccionado)
  .then(response=>{
    setData(data.concat(response.data));
    abrirCerrarModalInsertar();
  }).catch(error=>{
    console.log(error);
  })
}

const peticionPut=async()=>{ 
  productoSeleccionado.iPrecio = parseInt(productoSeleccionado.iPrecio);
  await axios.put(baseUrl+"/"+productoSeleccionado.iCodProducto, productoSeleccionado)
  .then(response=>{
    var respuesta = response.data;
    var dataAuxiliar = data
    //setData(data.concat(response.data));    
    dataAuxiliar.map(producto=>{
      if(producto.iCodProducto === respuesta.iCodProducto){
      producto.vDescripcion = respuesta.vDescripcion;
      producto.iPrecio = respuesta.iPrecio;
    }
    });
    abrirCerrarModalEditar();
  }).catch(error=>{
    console.log(error);
  })
}

const peticionDelete=async()=>{   
  await axios.delete(baseUrl+"/"+productoSeleccionado.iCodProducto)
  .then(response=>{
    setData(data.filter(producto=>producto.iCodProducto!==response.data));   
    abrirCerrarModalEliminar();     
  }).catch(error=>{
    console.log(error);
  })
}


const seleccionarProducto=(producto, caso)=>{
  setProductoSeleccionado(producto);
  (caso === "Editar") ?
  abrirCerrarModalEditar(): abrirCerrarModalEliminar();
}

useEffect(()=>{
  peticionGet();
},[])

  return (
    <div className="App">
      <br/><br/>
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insertar nuevo producto</button>
      <br/><br/>
     <table className='table table-bordered'>
      <thead>
        <tr>
          <th>Código Producto</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(producto=>(
          <tr key={producto.iCodProducto}>
            <td>{producto.iCodProducto}</td>
            <td>{producto.vDescripcion}</td>
            <td>{producto.iPrecio}</td>
            <td>
              <button className="btn btn-primary" onClick={()=>seleccionarProducto(producto, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarProducto(producto, "Eliminar")}>Eliminar</button>
            </td>
          </tr>
            
        ))}
      </tbody>
     </table>


<Modal isOpen={modalInsertar}>
<ModalHeader>Insertar Producto en Base de Datos</ModalHeader>
<ModalBody>
<div className="form-group">
  <label>Descripción Producto</label>
  <br />
  <input type="text" className="form-control" name="vDescripcion" onChange={handleChange}/>
  <br />
  <label>Precio</label>
  <br/>
  <input type="text" className="form-control" name="iPrecio" onChange={handleChange}/>
  <br/>
  </div>
</ModalBody>
<ModalFooter>
  <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"  "}
  <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
</ModalFooter>
</Modal>


<Modal isOpen={modalEditar}>
<ModalHeader>Editar Producto en Base de Datos</ModalHeader>
<ModalBody>
<div className="form-group">
<label>ID Producto</label>
  <br />
  <input type="text" className="form-control" readOnly value={productoSeleccionado && productoSeleccionado.iCodProducto}/>
  <br />
  <label>Descripción Producto</label>
  <br />
  <input type="text" className="form-control" name="vDescripcion" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.vDescripcion}/>
  <br />
  <label>Precio</label>
  <br/>
  <input type="text" className="form-control" name="iPrecio" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.iPrecio}/>
  <br/>
  </div>
</ModalBody>
<ModalFooter>
  <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"  "}
  <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
</ModalFooter>
</Modal>


<Modal isOpen={modalEliminar}>
<ModalBody>
¿Estás seguro que deseas eliminar el producto de la base de datos?
</ModalBody>
<ModalFooter>
  <button className="btn btn-danger" onClick={()=>peticionDelete()}>Sí</button>
  <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>No</button>
</ModalFooter>

</Modal>


    </div>
  );
}

export default App;
