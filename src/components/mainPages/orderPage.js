// Import supporting files
import React, { Fragment } from "react";
import Navigation from '../navigation';

import CheesecakeSelector from '../cheesecakeSelector';

export default class OrderPage extends React.Component 
{

    constructor(props) 
    {
      super(props);
  
      this.addCheesecake = this.addCheesecake.bind(this);
      this.removeCheesecake = this.removeCheesecake.bind(this);
      this.adjustTotal = this.adjustTotal.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
          cheesecakeSelectors: [<CheesecakeSelector removeCheesecakeClick={this.removeCheesecake} adjustTotal={this.adjustTotal} uniqueID={0}/>],
           uniqueID: 0,
           totalCost: 0
        };
    }
  
    addCheesecake() 
    {
        let newArray = this.state.cheesecakeSelectors;
        let newUniqueID = this.state.uniqueID + 1;
        newArray.push(<CheesecakeSelector removeCheesecakeClick={this.removeCheesecake} adjustTotal={this.adjustTotal} uniqueID={newUniqueID}/>);
        this.setState({ cheesecakeSelectors: newArray, uniqueID: newUniqueID });
    }

    removeCheesecake = (uniqueIDToRemove) => 
    {
        console.log('UniqueID to remove:');
        console.log(uniqueIDToRemove);

        if (this.state.cheesecakeSelectors.length > 1)
        {
            let newArray = this.state.cheesecakeSelectors;
            var indexLocation = -1;

            newArray.forEach((childObj,index) => {
                
                if (childObj.props.uniqueID === uniqueIDToRemove) 
                {
                    console.log('found index location: ' + index);
                    indexLocation = index;   
                }
            });

            let removedItem = newArray.splice(indexLocation,1);

            // newArray.splice(indexLocation,1);

            console.log('removed item: ');
            console.log(removedItem);

            // console.log('new array: ');
            // console.log(newArray);
            
            this.setState({ cheesecakeSelectors: newArray });
        }
        
    }

    adjustTotal = (costAdjustmentValue) => 
    {
        var tempCost = this.state.totalCost;
        tempCost = tempCost + costAdjustmentValue;

        this.setState({totalCost: tempCost});
    }

    handleSubmit(event) 
    {
        alert('You submitted the form!');
        event.preventDefault();
    }

  
    render() {
        
        return(
            <Fragment>
                <Navigation />
                <form onSubmit={this.handleSubmit}>

                    <label className="title">ORDER FORM</label>

                    <label className="subtitle">CONTACT INFORMATION</label>

                    <label htmlFor="firstName" className="first-name">First:</label>
                    <input id="firstName" type="text"/>

                    <label htmlFor="lastName" className="last-name">Last:</label>
                    <input id="lastName" type="text"/>

                    <label htmlFor="phoneNumber" className="phoneNumber">Phone #:</label>
                    <input id="phoneNumber" type="tel"/>

                    <label htmlFor="email" className="email">Email:</label>
                    <input id="email" type="email"/>

                    <label htmlFor="address" className="address">Address:</label>
                    <input id="address" type="text"/>

                    <label htmlFor="city" className="city">City:</label>
                    <input id="city" type="text"/>

                    <label htmlFor="state" className="state">State:</label>
                    <input id="state" type="text"/>

                    <label htmlFor="zip" className="zip">Zip Code:</label>
                    <input id="zip" type="text"/>

                    <label htmlFor="deliveryDate" className="deliveryDate">Delivery Date:</label>
                    <input id="deliveryDate" type="text"/>
                    <hr />

                    <label className="subtitle">CHEESECAKES</label>
                {
                    this.state.cheesecakeSelectors.map((cheesecakeSelector) => (
                        <React.Fragment key={cheesecakeSelector.props.uniqueID}>
                            { cheesecakeSelector }
                         </React.Fragment>))
                }
                    
                    <button type="button" onClick={this.addCheesecake}> Add Cheesecake </button> 
                    <hr />

                    <label className="subtitle">ORDER SUMMARY</label>

                    <label className="totalCost">Total Cost: ${this.state.totalCost}</label>
                    <button className="myButton">Submit</button>
                </form>
                
            </Fragment>
        );
    
    }
  }