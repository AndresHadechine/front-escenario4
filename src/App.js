import './App.css';
import { Component } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8080/ListAll";
const urlSave = "http://localhost:8080/save";

class App extends Component {

state = {
  data:[],
  modelInsert: false,
  form:{
    plate: '',
    brand: '',
    model: '',
    driver: {
    id: '',
    name: '',
    }
  }
}
modalInsert=()=>{
  this.setState({modalInsert: !this.state.modalInsert});
}
getPetition=()=>{
  axios.get(url).then(response=>{
    this.setState({data: response.data});
    console.log(response.data);
  })
}
postPetition=async()=>{
  await axios.post(urlSave,this.state.form).then(response=>{
    this.modalInsert();
    this.getPetition();
  }).catch(error=>{console.log(error.message)})
}
handleChange=async e=>{
  e.persist();
  await this.setState({
    form:{
      ...this.state.form,
      [e.target.name]: e.target.value
    }
  });
  console.log(this.state.form);
}
handleChangeDriver=async e=>{
  e.persist();
    this.state.form.driver.name = e.target.value
  console.log(this.state.form);
}
handleChangeDriverId=async e=>{
  e.persist();
    this.state.form.driver.id = e.target.value
  console.log(this.state.form);
}

componentDidMount(){
this.getPetition();
}
  render(){
    const {form}=this.state;
  return (
    <div className="App">
      <br />
        <button className= "btn btn-success" onClick={()=> this.modalInsert()} >Crear información del auto</button>
        <br /><br />
        <table className="table">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Conductor</th>
            </tr>
          </thead>
          <tbody>
          {this.state.data.map(car=>{
            return(
              <tr>
                  <td>{car.plate}</td>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>{car.driver.name}</td>
                  <td>
                  <button className="btn btn-primary" >Info</button>
                    {"    "}
                    <button className="btn btn-primary" >Editar</button>
                    {"    "}
                    <button className="btn btn-danger" ><FontAwesomeIcon icon = {faTrashAlt} /></button>
                  </td>
              </tr>
            )
          })
          }
          </tbody>
        </table>
        <Modal isOpen={this.state.modalInsert}>
          <ModalHeader style={{display: 'block'}}>
            <span style = {{float: 'right'}}>x</span>
          </ModalHeader>
          <ModalBody className="form-group">
            <div className="form-group">
              <label htmlFor="plate">Placa</label>
              <input className = "form-group" type = "text" name = "plate" id = "plate" onChange={this.handleChange} value={form.plate} />
              <br />
              <label htmlFor="brand">Marca</label>
              <input className = "form-group" type = "text" name = "brand" id = "brand" onChange={this.handleChange} value={form.brand} />
              <br />
              <label htmlFor="model">Modelo</label>
              <input className = "form-group" type = "text" name = "model" id = "model" onChange={this.handleChange} value={form.model} />
              <br />
              <label htmlFor="id">ID Conductor</label>
              <input className = "form-group" type = "text" name = "driver.id" id = "driver.id" onChange={this.handleChangeDriverId} />
              <br />
              <label htmlFor="name">Nombre Conductor</label>
              <input className = "form-group" type = "text" name = "driver.name" id = "driver.name" onChange={this.handleChangeDriver} />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={()=>this.postPetition()}>Insertar</button>
            <button className="btn btn-danger" onClick={()=> this.modalInsert()}>Cancelar</button>
          </ModalFooter>
        </Modal>
    </div>
  );
}
}

export default App;
