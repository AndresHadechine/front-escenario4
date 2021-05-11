import './App.css';
import { Component} from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader, Table, Input, Label} from 'reactstrap';
import Displacement from './components/Displacement';


const url = "http://localhost:8080/ListAll";
const urlSave = "http://localhost:8080/save";
const urlUpdate = "http://localhost:8080/update/";
const urlDelete = "http://localhost:8080/delete/";


class App extends Component {

  state = {
    data: [],
    modelInsert: false,
    modelDelete: false,
    modelDisplacement: false,
    form: {
      plate: '',
      brand: '',
      model: '',
      driver: {
        id: '',
        name: '',
      },
      typeModal: '',
    },
  }
  
  modalInsert = () => {
    this.setState({ modalInsert: !this.state.modalInsert });
  }
  modalDisplacement = () =>{
    this.setState({ modelDisplacement: !this.state.modalDisplacement});
  }
  selectCar = (car) => {
    this.setState({
      typeModal: 'update',
      form: {
        plate: car.plate,
        brand: car.brand,
        model: car.model,
        driver: {
          id: car.driver.id,
          name: car.driver.name,
        }
      }
    })
  }
  getPetition = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data });
      console.log(response.data);
    })
  }
  postPetition = async () => {
    await axios.post(urlSave, this.state.form).then(response => {
      this.modalInsert();
      this.getPetition();
    }).catch(error => { console.log(error.message) })
  }
  putPetition = async () => {
    axios.put(urlUpdate + this.state.form.plate, this.state.form).then(response => {
      this.modalInsert();
      this.getPetition();
    })
  }
  deletePetition = () => {
    axios.delete(urlDelete + this.state.form.plate).then(response => {
      this.setState({ modelDelete: false });
      this.getPetition();
    })
  }
  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }
  handleChangeDriver = async e => {
    e.persist();
    this.state.form.driver.name = e.target.value
    console.log(this.state.form);
  }
  handleChangeDriverId = async e => {
    e.persist();
    this.state.form.driver.id = e.target.value
  }

  componentDidMount() {
    this.getPetition();
  }
  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br />
        <button className="btn btn-success" onClick={() => {
          this.setState({
            form: {
              plate: '', brand: '', model: '', driver: { id: '', name: '', },
              typeModal: '',
            }, typeModal: 'insert'
          }); this.modalInsert()
        }} >Crear información del Auto</button>
        <br /><br />
        <Table className="table">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Conductor</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody >
            {this.state.data.map(car => {
              return (
                <tr>
                  <td><b>{car.plate}</b></td>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>{car.driver.name}</td>
                  <td>
                    <button className="btn btn-success" onClick={() => { this.selectCar(car); this.modalDisplacement() }} >Desplazamientos</button>
                    {"    "}
                    <button className="btn btn-primary" onClick={() => { this.selectCar(car); this.modalInsert() }} >Editar</button>
                    {"    "}
                    <button className="btn btn-danger" onClick={() => { this.selectCar(car); this.setState({ modelDelete: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
                </tr>
              )
            })
            }
          </tbody>
        </Table>
        <Modal isOpen={this.state.modalInsert}>
          <ModalHeader style={{ display: 'block' }}>
            <span>Información del Carro</span>
          </ModalHeader>
          <ModalBody className="form-group">
            <div className="form-group">
              <label htmlFor="plate">Placa</label>
              <Input className="form-group" type="text" name="plate" id="plate" onChange={this.handleChange} value={form ? form.plate : ''} />
              <br />
              <label htmlFor="brand">Marca</label>
              <Input className="form-group" type="text" name="brand" id="brand" onChange={this.handleChange} value={form ? form.brand : ''} />
              <br />
              <label htmlFor="model">Modelo</label>
              <Input className="form-group" type="text" name="model" id="model" onChange={this.handleChange} value={form ? form.model : ''} />
              <br />
              <label htmlFor="id">ID Conductor</label>
              <Input className="form-group" type="text" name="driver.id" id="driver.id" onChange={this.handleChangeDriverId} />
              <br />
              <label htmlFor="name">Nombre Conductor</label>
              <Input className="form-group" type="text" name="driver.name" id="driver.name" onChange={this.handleChangeDriver} />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            {this.state.typeModal === 'insert' ?
              <button className="btn btn-success" onClick={() => this.postPetition()}>Insertar</button> :
              <button className="btn btn-success" onClick={() => this.putPetition()}>Actualizar</button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsert()}>Cancelar</button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modelDelete}>
          <ModalBody>
            Estás seguro de que deseas eliminar el carro con placas <br /><b>{form && form.plate}</b>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.deletePetition()} >Si</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modelDelete: false })}>No</button>
          </ModalFooter>
        </Modal>
        <Modal size="lg" isOpen={this.state.modelDisplacement}>
          <ModalHeader closeButton><label>Desplazamientos de <b>{form && form.plate}</b></label></ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Fecha Origen</th>
                  <th>Fecha Destino</th>
                </tr>
              </thead> 
                <Displacement plate = {form.plate} />
            </Table>
            <h7><b>Agregar Desplazamiento para este vehiculo</b></h7>
            <div>
            <Label>Origen</Label>
            <Input></Input>
            <label>Destino</label>
            <Input></Input>
            <label>Fecha Origen</label>
            <Input type="date"></Input>
            <label>Fecha Destino</label>
            <Input type="date"></Input>
            </div>
          </ModalBody>
          <ModalFooter>
                <button className="btn btn-success">Aceptar</button>
                <button className="btn btn-primary" onClick={() => this.setState({ modelDisplacement: false })}>Cerrar</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
