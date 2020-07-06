// Import supporting files
import React, { Fragment } from "react";

// Create CheesecakeSelector component

export default class CheesecakeSelector extends React.Component {

    /*
        Constructor - this contstructor helps setup the state for the component.

        cheesecakeTypes - array of types of cheesecakes from the database. Consists of 3 properties
              index: Integer - index in database
               type: String - description of the group of cheesecakes
              price: Integer - general price of cheesecake group

        selectorValues - Array of strings for cheesecake types
        value - String cheesecake type
        value2 - String cheesecake name
        specialRequest - String request from the user
        cost - Integer
        qty - Integer
    */

    constructor(props) 
    {
      super(props);

      // Make the functions of this class available

      this.handleChange = this.handleChange.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleChange4 = this.handleChange4.bind(this);

      // Setup the initial state of the selector page

      this.state = {
          cheesecakeTypes: props.cheesecakes,
          selectorValues: [],
          value: '', 
          value2: '', 
          specialRequest: '', 
          cost: 0, 
          qty: 1
        };
    }

    /**************************************************************************************************************
        componentDidMount
        parameters: N/A
        Return: N/A

        description: The componentDidMount function is used to setup the initial values for the display of the 
                     selector.
    **************************************************************************************************************/

    componentDidMount()
    {
        // setup temp variables
        let baseCost = this.state.cheesecakeTypes[0].price;
        let adjCost = this.state.cheesecakeTypes[0].Cakes[0].adjprice;
        let tempSelectorValues = [];
        let tempCakes = [];

        // setup selectorValues from the cheesecakeTypes
        this.state.cheesecakeTypes.forEach(type => {
            type.Cakes.forEach( cake => {
                tempCakes.push(cake.name);
            });
            tempSelectorValues.push({type: type.type, cakes: tempCakes});
            tempCakes = [];
        });

        // update the state
        this.setState({
            selectorValues: tempSelectorValues,
            value: this.state.cheesecakeTypes[0].type,
            value2: this.state.cheesecakeTypes[0].Cakes[0].name,
            cost: baseCost + adjCost
        });

        // update the total with new cost
        this.props.adjustTotal(baseCost + adjCost);
    }

    /**************************************************************************************************************
        componentWillUnmount
        parameters: N/A
        Return: N/A

        description: The function will update the cost for the user.
    **************************************************************************************************************/

    componentWillUnmount()
    {
        var tempCost = this.state.cost*this.state.qty*-1;
        this.props.adjustTotal((tempCost));
    }

    /**************************************************************************************************************
        sendData
        parameters: N/A
        Return: N/A

        description: The function will send to order page the unique id to remove the selector from view.
    **************************************************************************************************************/

    sendData = () =>
    {
        let uniqueID = this.props.uniqueID;
        this.props.removeCheesecakeClick(uniqueID);
    }

    /**************************************************************************************************************
        changeQty
        parameters: event
        Return: N/A

        description: The function will update the qty of cheesecakes and then update the total and order details
                     on the order page.
    **************************************************************************************************************/

    changeQty = (event) =>
    {
        // setup the temp variables with info from event
        let currentQty = this.state.qty;
        let newQty = parseInt(event.target.value);
        let tempCost = this.state.cost;
        let adjustmentCost = ((tempCost*currentQty) - (tempCost*newQty))*-1

        // update the order 
        this.props.adjustTotal((adjustmentCost));
        this.props.updateOrder({uniqueID: this.props.uniqueID, type: this.state.value, cheesecake: this.state.value2, qty: newQty, price: this.state.cost, request: this.state.specialRequest})
        this.setState({qty: newQty})
    }
  
    /**************************************************************************************************************
        handleChange
        parameters: event
        Return: N/A

        description: The function will update the state value and then update the cost and order details
                     on the order page.
    **************************************************************************************************************/

    handleChange(event) 
    {
        // setup temp variables
        var tempCost = this.state.cost;
        var newCost = 0;
        var newCake = '';

        // loop through cheesecake types to find the cheesecake selected and adjust the cost
        this.state.cheesecakeTypes.forEach((type) => 
        {
            if (event.target.value === type.type) 
            {
                this.props.adjustTotal((tempCost-type.price)*this.state.qty*-1);
                newCost = type.price;
                newCake = type.Cakes[0].name;
            }
        });

        // update the order with new information
        this.props.updateOrder({uniqueID: this.props.uniqueID, type: event.target.value, cheesecake: newCake, qty: this.state.qty, price: newCost, request: this.state.specialRequest})

        // set the state with the new information
        this.setState({value: event.target.value, value2: newCake, cost: newCost});
    }

    /**************************************************************************************************************
        handleChange2
        parameters: event
        Return: N/A

        description: The function will update the state value2 and then update the order details
                     on the order page.
    **************************************************************************************************************/

    handleChange2(event) 
    {

        // update the order with new information
        this.props.updateOrder({uniqueID: this.props.uniqueID, type: this.state.value, cheesecake: event.target.value, qty: this.state.qty, price: this.state.cost, request: this.state.specialRequest})

        // set the state with the new information
        this.setState({value2: event.target.value});
    }

    /**************************************************************************************************************
        handleChange4
        parameters: event
        Return: N/A

        description: The function will update the state request and then update the order details
                     on the order page.
    **************************************************************************************************************/

    handleChange4(event) 
    {
        this.props.updateOrder({uniqueID: this.props.uniqueID, type: this.state.value, cheesecake: this.state.value2, qty: this.state.qty, price: this.state.cost, request: event.target.value})
        this.setState({specialRequest: event.target.value});
    }
  
    render() 
    {
        // Get necessary state variables
        const { selectorValues } = this.state;
        let options = [];
        let options2 = [];

        selectorValues.forEach((value, index) => 
        {

           options.push(<option value={value.type} key={index}>{value.type} Cheesecake</option>)

           if (this.state.value === value.type) 
           {
               value.cakes.forEach((cake, index) => 
               {
                   options2.push(<option value={cake} key={index}>{cake.replace(' Cheesecake', '')}</option>)
               })
           }

        });

        if (options2.length < 2) 
        {
            return(
                <Fragment>
                    <br />
                    <br />
                    <br />
                    <button type="button" onClick={this.sendData}> Remove Cheesecake </button>
                    <label className="quantity">QTY: </label> <input type="number" id="quantity" name="quantity" value={this.state.qty}
            min="1" max="100" onChange={this.changeQty}></input>
                    <label className="cheesecakeSelector"> Cheesecake Type: </label>
                    <select value={this.state.value} onChange={this.handleChange}>
                        { options }
                    </select>  
                    <textarea value={this.state.specialRequest} placeholder="Speical Request..." onChange={this.handleChange4} />
                    <br />
                </Fragment>
                
            );
        } 
        else 
        {
            return(
                <Fragment>
                    <br />
                    <br />
                    <br />
                    <button type="button" onClick={this.sendData}> Remove Cheesecake </button>
                    <label className="quantity">QTY: </label> <input type="number" id="quantity" name="quantity" value={this.state.qty}
            min="1" max="100" onChange={this.changeQty}></input>
                    <label className="cheesecakeSelector"> Cheesecake Type: </label>
                    <select value={this.state.value} onChange={this.handleChange}>
                        { options }
                    </select> 
                    <label className="cheesecakeSelector"> {this.state.value}: </label>
                     <select value={this.state.value2} onChange={this.handleChange2}>
                        { options2 }
                     </select>
                     <br /> 
                    <textarea value={this.state.specialRequest} placeholder="Speical Request..." onChange={this.handleChange4} />
                    <br />
                </Fragment>  
            );
        }      
    }
  }