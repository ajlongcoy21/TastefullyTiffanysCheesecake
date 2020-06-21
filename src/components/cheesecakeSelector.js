// Import supporting files
import React, { Fragment } from "react";

export default class CheesecakeSelector extends React.Component {
    constructor(props) 
    {
      super(props);

      this.state = {value: 'originalCheesecake', value2: 'blueberry', value3: 'carmel', specialRequest: "", cost: 25, qty: 1};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleChange3 = this.handleChange3.bind(this);
      this.handleChange4 = this.handleChange4.bind(this);
    }

    componentDidMount()
    {
        var tempCost = this.state.cost*this.state.qty;
        this.props.adjustTotal((tempCost));

    }

    componentWillUnmount()
    {
        var tempCost = this.state.cost*this.state.qty*-1;
        this.props.adjustTotal((tempCost));
    }

    sendData = () =>
    {
        let uniqueID = this.props.uniqueID;
        this.props.removeCheesecakeClick(uniqueID);
    }

    changeQty = (event) =>
    {
        let currentQty = this.state.qty;
        let newQty = event.target.value;
        let tempCost = this.state.cost;
        let adjustmentCost = ((tempCost*currentQty) - (tempCost*newQty))*-1

        this.props.adjustTotal((adjustmentCost));

        this.setState({qty: newQty})
    }
  
    handleChange(event) 
    {
        var tempCost = this.state.cost;
        var newCost = 0;

        switch (event.target.value) 
        {
            case 'originalCheesecake':
                this.props.adjustTotal((tempCost-25)*this.state.qty*-1);
                newCost = 25;
                break;
            case 'originalCheesecakeFruit':
                this.props.adjustTotal((tempCost-30)*this.state.qty*-1);
                newCost = 30;
                break;
            case 'specialtyCheesecake':
                this.props.adjustTotal((tempCost-32)*this.state.qty*-1);
                newCost = 32;
                break;
            default:
                newCost = 0;
                break;
        }

        this.setState({value: event.target.value, cost: newCost});
    }
    handleChange2(event) 
    {
        this.setState({value2: event.target.value});
    }
    handleChange3(event) 
    {
        this.setState({value3: event.target.value});
    }

    handleChange4(event) 
    {
        this.setState({specialRequest: event.target.value});
    }
  
    render() {
        if (this.state.value === 'originalCheesecake') 
        {
            return (
                <Fragment>
                    <br />
                    <br />
                    <br />
                    <button type="button" onClick={this.sendData}> Remove Cheesecake </button>
                    <label className="quantity">QTY: </label> <input type="number" id="quantity" name="quantity" value={this.state.qty}
       min="1" max="100" onChange={this.changeQty}></input>
                    <label className="cheesecakeSelector">
                        Cheesecake Type:
                    </label>
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value="originalCheesecake">Original Cheesecake</option>
                        <option value="originalCheesecakeFruit">Original Cheesecake + Fruit</option>
                        <option value="specialtyCheesecake">Specialty Cheesecake</option>
                    </select>
                    <textarea value={this.state.specialRequest} placeholder="Speical Request..." onChange={this.handleChange4} />
                    <br />
                </Fragment>  
            );
        } 
        else if (this.state.value === 'originalCheesecakeFruit')
        {
            return (
                <Fragment>
                    <br />
                    <br />
                    <br />
                    <button type="button" onClick={this.sendData}> Remove Cheesecake </button>
                    <label className="quantity">QTY: </label> <input type="number" id="quantity" name="quantity" value={this.state.qty}
       min="1" max="100" onChange={this.changeQty}></input>
                    <label className="cheesecakeSelector">
                        Cheesecake Type:
                    </label>
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value="originalCheesecake">Original Cheesecake</option>
                        <option value="originalCheesecakeFruit">Original Cheesecake + Fruit</option>
                        <option value="specialtyCheesecake">Specialty Cheesecake</option>
                    </select>
                    <label className="cheesecakeSelector">
                        Fruit Topping:
                    </label>
                    <select value={this.state.value2} onChange={this.handleChange2}>
                        <option value="blueberry">Blueberry</option>
                        <option value="coconut">Coconut</option>
                        <option value="keylime">Key Lime</option>
                        <option value="strawberry">Strawberry</option>
                        <option value="lemon">Lemon</option>
                        <option value="mixedberry">Mixed Berry</option>
                    </select>
                    <br />
                    <textarea value={this.state.specialRequest} placeholder="Speical Request..." onChange={this.handleChange4} />
                </Fragment>  
            );
        }
        else
        {
            return (
                <Fragment>
                    <br />
                    <br />
                    <br />
                    <button type="button" onClick={this.sendData}> Remove Cheesecake </button>
                    <label className="quantity">QTY: </label> <input type="number" id="quantity" name="quantity" value={this.state.qty}
       min="1" max="100" onChange={this.changeQty}></input>
                    <label className="cheesecakeSelector">
                        Cheesecake Type:
                    </label>
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value="originalCheesecake">Original Cheesecake</option>
                        <option value="originalCheesecakeFruit">Original Cheesecake + Fruit</option>
                        <option value="specialtyCheesecake">Specialty Cheesecake</option>
                    </select>
                    <label className="cheesecakeSelector">
                        Speciality Flavor:
                    </label>
                    <select value={this.state.value3} onChange={this.handleChange3}>
                        <option value="carmel">Carmel</option>
                        <option value="carmelpecanturtle">Carmel Pecan Turle</option>
                        <option value="ghiradellichocolate">Chiradelli Chocolate</option>
                        <option value="oreo">Oreo</option>
                        <option value="reeses">Resses</option>
                        <option value="tennesseewhisky">Tennessee Whisky</option>
                        <option value="vanillabean">Vanilla Bean</option>
                        </select>
                    <br />
                    <textarea value={this.state.specialRequest} placeholder="Speical Request..." onChange={this.handleChange4} />
                </Fragment>  
            );
        }
      
    }
  }