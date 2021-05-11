
import { Component} from 'react';
import axios from 'axios';

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
      );
  }

}
export default Displacement;