
import { Component} from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader, Table, Input, Label} from 'reactstrap';

const urlListDisplacement = "http://localhost:8080/ListDisplacementCar/";
const urlSaveDisplacement = "http://localhost:8080/saveDisplacement";

class Displacement extends Component{

  state = {
    data: [],
    form: {
      carPlate: this.props.plate,
      origin: '',
      destiny: '',
      dateOrigin: '',
      dateDestiny: '',
    }
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
  selectDisplacement = (displacement) => {
    this.setState({
      form: {
        carPlate: displacement.carPlate,
        origin: displacement.origin,
        destiny: displacement.destiny,
        dateOrigin: displacement.dateOrigin,
        dateDestiny: displacement.dateDestiny,
        }
      }
    )
  }
  getPetitionDisplacement = () => {
    axios.get(urlListDisplacement+this.props.plate).then(response => {
      this.setState({ data: response.data });
      console.log(response.data);
    })
  }
  postPetitionDisplacement = async () => {
    await axios.post(urlSaveDisplacement, this.state.form).then(response => {
      this.getPetitionDisplacement();
    }).catch(error => { console.log(error.message) })
  }
  componentDidMount() {
    this.getPetitionDisplacement();
  }
  render() {
      return(
          <>
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
        <tbody>
            {console.log("propos",this.props.plate)}
    {this.state.data.map(displacement => {
        return (
          <tr>
            <td>{displacement.origin}</td>
            <td>{displacement.destiny}</td>
            <td>{displacement.dateOrigin}</td>
            <td>{displacement.dateDestiny}</td>
          </tr>
        )
      }
      )}
        </tbody>
        </Table>
            <h7><b>Agregar Desplazamiento para este vehiculo</b></h7>
            <div>
            <Label>Origen</Label>
            <Input name="origin" id="origin" onChange={this.handleChange} ></Input>
            <label>Destino</label>
            <Input name="destiny" id="destiny" onChange={this.handleChange}></Input>
            <label>Fecha Origen</label>
            <Input type="date" name="dateOrigin" id="dateOrigin" onChange={this.handleChange} ></Input>
            <label>Fecha Destino</label>
            <Input type="date" name="dateDestiny" id="dateDestiny" onChange={this.handleChange}></Input>
            </div>
          </ModalBody>
            <ModalFooter>
                <button className="btn btn-success" onClick={() => this.postPetitionDisplacement()} >Aceptar</button>
            </ModalFooter>
        </>
      );
  }

}
export default Displacement;