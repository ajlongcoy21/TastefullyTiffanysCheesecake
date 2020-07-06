// Import supporting files
import React, { Fragment } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Import supporting components
import Navigation from '../navigation';
import Footer from '../footer';
import Payment from '../payment';
import CheesecakeSelector from '../cheesecakeSelector';

// Create OrderPage component

export default class OrderPage extends React.Component 
{

    /*
        Constructor - this contstructor helps setup the state for the component.

        cheesecakeTypes - array of types of cheesecakes from the database. Consists of 3 properties
              index: Integer - index in database
               type: String - description of the group of cheesecakes
              price: Integer - general price of cheesecake group

        typesAreLoaded - boolean to indicate the cheesecake types were retrieved from the database
        cheesecakeSelectors - Array of the component cheesecakeSelector
        cheesecakesOrdered - Array of the cheesecakes the user selected on order form

        contactInformation - Object of types of information from the user in the order form. Consists of 9 properties
                 firstName: String - user first name
                  lastName: String - user last name
               phoneNumber: String - phone number of user
                     email: String - email of user
                   address: String - address of user
                      city: String - city of user
                     state: String - state of user
                       zip: Integer - zip code of user
              deliveryDate: Date - delivery date of user

        errorLog - Array of errors detected on the form
        ordered - boolean to detect when the user submits valid information for the order
        uniqueID - Integer used to identify the cheesecakeSelector in the array when they are added to the page
        totalCost - Integer used to show user the total cost of their selections
    */

    constructor(props) 
    {
      super(props);
  
      // Make the functions of this class available to specifically the cheesecakeSelector component

      this.addCheesecake = this.addCheesecake.bind(this);
      this.removeCheesecake = this.removeCheesecake.bind(this);
      this.changeOrderedCheesecake = this.changeOrderedCheesecake.bind(this);
      this.adjustTotal = this.adjustTotal.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      // Get a new date and add 2 days (48 hr lead time for cheesecakes)
      let newDate = new Date();
      newDate.setDate(newDate.getDate() + 2);

      // Setup the initial state of the order page
      this.state = {
            typesAreLoaded: false,
            cheesecakeTypes: null,
            cheesecakeSelectors: [],
            cheesecakeOrdered: [],
            contactInformation: {
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                address: '',
                city: '',
                state: 'TX',
                zip: '',
                deliveryDate: newDate
            },
            errorLog: [],
            ordered: false,
            uniqueID: 0,
            totalCost: 0
        };
    }

    /**************************************************************************************************************
        componentDidMount
        parameters: N/A
        Return: N/A

        description: The componentDidMount function is used to makes calls to the database for the types of cheesecakes.
                     If successful it will update the following information in the state:

                     cheesecakeTypes, typesAreLoaded
    **************************************************************************************************************/

    componentDidMount()
    {
        var self = this;

        // Make a call to the api for the complete list of cheesecake types
        //https://ttcapi.azurewebsites.net
        axios.get(`https://ttcapi.azurewebsites.net/api/cheesecake-types`)
        .then(response => {
            
            // Set the state on successful return of cheesecake types data
            this.setState({
                typesAreLoaded: true,             // data is loaded
                cheesecakeTypes: response.data    // set the cheesecakeTypes state variable to the response data
            });

            this.addCheesecake();
        })
        .catch(error => { 

            // Check to see if the server responded with an error and response for the error
            if (error.response) 
                {
                    // If the server responds with a status of 500 set the error state to true for the redirect to error page
                    if (error.response.status === 500) 
                    {
                        self.setState({error: true});
                    }
                } 
                else if (error.request) 
                {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } 
                else 
                {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }

                console.log(error.config); 
        })
    }
  
    /**************************************************************************************************************
        addCheesecake
        parameters: N/A
        Return: N/A

        description: The addCheesecake function is used to add cheesecake selectors to the page for the user.
    **************************************************************************************************************/

    addCheesecake() 
    {
        // setup temp variables for adding new selector to the page
        let tempOrder = [];
        let newArray = this.state.cheesecakeSelectors;
        let newUniqueID = this.state.uniqueID + 1;

        // make a new cheesecake selector and add to the array
        newArray.push(<CheesecakeSelector removeCheesecakeClick={this.removeCheesecake} updateOrder={this.changeOrderedCheesecake} adjustTotal={this.adjustTotal} cheesecakes={this.state.cheesecakeTypes} uniqueID={newUniqueID}/>);

        // for the cheesecake added to the page, update the order information with the default information of the cheesecake added and put on array
        tempOrder = this.state.cheesecakeOrdered;
        tempOrder.push({uniqueID: newUniqueID, type: this.state.cheesecakeTypes[0].type, cheesecake: this.state.cheesecakeTypes[0].Cakes[0].name, qty: 1, price: this.state.cheesecakeTypes[0].price + this.state.cheesecakeTypes[0].Cakes[0].adjprice, request: '' });

        // update the state with the new information
        this.setState({ cheesecakeSelectors: newArray, cheesecakeOrdered: tempOrder, uniqueID: newUniqueID });
    }

    /**************************************************************************************************************
        removeCheesecake
        parameters: uniqueIDToRemove - Integer
        Return: N/A

        description: The removeCheesecake function is used to remove cheesecake selectors to the page for the user.
    **************************************************************************************************************/

    removeCheesecake = (uniqueIDToRemove) => 
    {
        // Check to see if we have more than 1 cheesecake on the screen. 

        if (this.state.cheesecakeSelectors.length > 1)
        {
            // setup temp variables
            let selectors = this.state.cheesecakeSelectors;
            let newOrder = this.state.cheesecakeOrdered;
            var indexLocation = -1;

            // loop through all selectors to see which one matches the id to remove
            selectors.forEach((selector,index) => {
                
                // check to see if the uniqueID matches the selector uniqueID
                if (selector.props.uniqueID === uniqueIDToRemove) 
                {
                    indexLocation = index;   
                }
            });

            // Remove selector and order infomration from the arrays
            selectors.splice(indexLocation, 1);
            newOrder.splice(indexLocation, 1);
            
            // update the state with the adjusted information for selectors and order
            this.setState({ cheesecakeSelectors: selectors, cheesecakeOrdered: newOrder });
        } 
    }

    /**************************************************************************************************************
        changeOrderedCheesecake
        parameters: cheescake - Object
                        uniqueID - Integer to identify cheescake selector information
                        type - String to indentify cheesecake type
                        cheesecake - String to identify cheesecake name
                        qty - Integer the amount the user wants
                        price - cost of the user selection
                        request - special request information from the user
        Return: N/A

        description: The changeOrderedCheesecake function is used to update order information for the user.
    **************************************************************************************************************/

    changeOrderedCheesecake = (cheesecake) =>
    {
        // setup temp variables 
        let newOrder = this.state.cheesecakeOrdered;
        var indexLocation = -1;

        // loop through all order to see which one matches the id to update
        newOrder.forEach((orderedCheesecake,index) => {
            
            // check to see if the uniqueID matches the order uniqueID
            if (cheesecake.uniqueID === orderedCheesecake.uniqueID) 
            {
                indexLocation = index;   
            }
        });

        // update the specific order with new cheesecake information
        newOrder.splice(indexLocation, 1, cheesecake);

        // update the state with the adjusted information for order
        this.setState({ cheesecakeOrdered: newOrder });

    }

    /**************************************************************************************************************
        adjustTotal
        parameters: costAdjustmentValue - Integer
        Return: N/A

        description: The function adjusts the total for the user.
    **************************************************************************************************************/

    adjustTotal = (costAdjustmentValue) => 
    {
        // Setup temp variables and adjust with costAdjustmentValue
        var tempCost = this.state.totalCost;
        tempCost = tempCost + costAdjustmentValue;

        // update totalCost in the state
        this.setState({totalCost: tempCost});
    }

    /**************************************************************************************************************
        handleChange
        parameters: event - object
        Return: N/A

        description: The function takes the event from the form and updates state values for the changing inputs.
    **************************************************************************************************************/

    handleChange(event)
    {

        // setup temp info
        let contactInformation = this.state.contactInformation;
        contactInformation[event.target.id] = event.target.value;
        
        // validate the information that is changing
        this.validateInfo(event.target.id, event.target.value);

        // update the contactInformation in the state
        this.setState({contactInformation: contactInformation});
        
    }

    /**************************************************************************************************************
        updateDate
        parameters: date - date
        Return: N/A

        description: The function takes the date from the form and updates date values for the changing inputs.
    **************************************************************************************************************/

    updateDate(date)
    {
        // setup temp variables and udpate the date in contactInformation
        let contactInformation = this.state.contactInformation;
        contactInformation['deliveryDate'] = date;

        // update contactInformation in state
        this.setState({contactInformation: contactInformation});
    }

    /**************************************************************************************************************
        validateInfo
        parameters: id - Integer
                    value - String or Integer
        Return: N/A

        description: The function validates the input from the form to help user enter correct information.
    **************************************************************************************************************/

    validateInfo(id, value)
    {
        let tempErrorLog = this.state.errorLog;
        let addError = true;
        let removeError = false;
        let removeIndex = -1;
        
        if (id === 'firstName') 
        {
            if (value === '') 
            {
                tempErrorLog.forEach(error => 
                {
                    if (error === 'First Name') 
                    {
                        addError = false;
                    }
                        
                }) 

                if (addError) 
                {
                    tempErrorLog.push('First Name');
                }
            }
            else
            {
                tempErrorLog.forEach( (error, index) => 
                {
                    if (error === 'First Name') 
                    {
                        removeError = true;
                        removeIndex = index;
                    }
                        
                }) 
                
                if (removeError) 
                {
                    tempErrorLog.splice(removeIndex, 1);
                }
            }
        }

        if (id === 'lastName') 
        {
            if (value === '') 
            {
                tempErrorLog.forEach(error => 
                {
                    if (error === 'Last Name') 
                    {
                        addError = false;
                    }
                        
                }) 

                if (addError) 
                {
                    tempErrorLog.push('Last Name');
                }
            }
            else
            {
                tempErrorLog.forEach( (error, index) => 
                {
                    if (error === 'Last Name') 
                    {   
                        removeError = true;
                        removeIndex = index;
                    }
                        
                }) 
                
                if (removeError) 
                {
                    tempErrorLog.splice(removeIndex, 1);
                }
            }
        }
        
        if (id === 'phoneNumber') 
        {
            var regex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/g;
            
            if (!regex.test(value)) 
            {
                tempErrorLog.forEach(error => 
                {
                    if (error === 'Phone Number') 
                    {
                        addError = false;
                    }
                        
                }) 

                if (addError) 
                {
                    tempErrorLog.push('Phone Number');
                }
            }
            else
            {
                tempErrorLog.forEach( (error, index) => 
                {
                    if (error === 'Phone Number') 
                    {   
                        removeError = true;
                        removeIndex = index;
                    }
                        
                }) 
                
                if (removeError) 
                {
                    tempErrorLog.splice(removeIndex, 1);
                }
            }
        }

        if (id === 'email') 
        {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            
            if (!regex.test(value)) 
            {
                tempErrorLog.forEach(error => 
                {
                    if (error === 'Email') 
                    {
                        addError = false;
                    }
                        
                }) 

                if (addError) 
                {
                    tempErrorLog.push('Email');
                }
            }
            else
            {
                tempErrorLog.forEach( (error, index) => 
                {
                    if (error === 'Email') 
                    {   
                        removeError = true;
                        removeIndex = index;
                    }
                        
                }) 
                
                if (removeError) 
                {
                    tempErrorLog.splice(removeIndex, 1);
                }
            }
        }

        if (id === 'address') 
        {
            if (value === '') 
            {
                tempErrorLog.forEach(error => 
                {
                    if (error === 'Address') 
                    {
                        addError = false;
                    }
                        
                }) 

                if (addError) 
                {
                    tempErrorLog.push('Address');
                }
            }
            else
            {
                tempErrorLog.forEach( (error, index) => 
                {
                    if (error === 'Address') 
                    {
                        removeError = true;
                        removeIndex = index;
                    }
                        
                }) 
                
                if (removeError) 
                {
                    tempErrorLog.splice(removeIndex, 1);
                }
            }
        }

        if (id === 'city') 
        {
            if (value === '') 
            {
                tempErrorLog.forEach(error => 
                {
                    if (error === 'City') 
                    {
                        addError = false;
                    }
                        
                }) 

                if (addError) 
                {
                    tempErrorLog.push('City');
                }
            }
            else
            {
                tempErrorLog.forEach( (error, index) => 
                {
                    if (error === 'City') 
                    {
                        removeError = true;
                        removeIndex = index;
                    }
                        
                }) 
                
                if (removeError) 
                {
                    tempErrorLog.splice(removeIndex, 1);
                }
            }
        }

        if (id === 'state') 
        {
            if (value === '') 
            {
                tempErrorLog.forEach(error => 
                {
                    if (error === 'State') 
                    {
                        addError = false;
                    }
                        
                }) 

                if (addError) 
                {
                    tempErrorLog.push('State');
                }
            }
            else
            {
                tempErrorLog.forEach( (error, index) => 
                {
                    if (error === 'State') 
                    {
                        removeError = true;
                        removeIndex = index;
                    }
                        
                }) 
                
                if (removeError) 
                {
                    tempErrorLog.splice(removeIndex, 1);
                }
            }
        }

        if (id === 'zip') 
        {
            var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;

            if (!zipCodePattern.test(value)) 
            {
                tempErrorLog.forEach(error => 
                {
                    if (error === 'Zip') 
                    {
                        addError = false;
                    }
                        
                }) 

                if (addError) 
                {
                    tempErrorLog.push('Zip');
                }
            }
            else
            {
                tempErrorLog.forEach( (error, index) => 
                {
                    if (error === 'Zip') 
                    {
                        removeError = true;
                        removeIndex = index;
                    }
                        
                }) 
                
                if (removeError) 
                {
                    tempErrorLog.splice(removeIndex, 1);
                }
            }
        }

        if (this.state.cheesecakeOrdered.length < 1) 
        {
            tempErrorLog.forEach(error => 
            {
                if (error === 'Cheesecake') 
                {
                    addError = false;
                }
                    
            }) 

            if (addError) 
            {
                tempErrorLog.push('Cheesecake');
            }
        }
        else
        {
            tempErrorLog.forEach( (error, index) => 
            {
                if (error === 'Cheesecake') 
                {
                    removeError = true;
                    removeIndex = index;
                }
                    
            }) 
            
            if (removeError) 
            {
                tempErrorLog.splice(removeIndex, 1);
            }
        }

        this.setState({errorLog: tempErrorLog});
        
    }

    /**************************************************************************************************************
        handleSubmit
        parameters: event
        Return: N/A

        description: The function handles the submit of the form, calls to validate the data and calls api to send 
                     email with information.
    **************************************************************************************************************/

    handleSubmit(event) 
    {      
        // Validate the inputs from the user
        this.validateInfo('firstName', this.state.contactInformation.firstName);
        this.validateInfo('lastName', this.state.contactInformation.lastName);
        this.validateInfo('phoneNumber', this.state.contactInformation.phoneNumber);
        this.validateInfo('email', this.state.contactInformation.email);
        this.validateInfo('address', this.state.contactInformation.address);
        this.validateInfo('city', this.state.contactInformation.city);
        this.validateInfo('state', this.state.contactInformation.state);
        this.validateInfo('zip', this.state.contactInformation.zip); 

        // check to make sure atleast 1 cheesecake is ordered and no errors are present in the form
        if (this.state.cheesecakeOrdered.length < 1) 
        {
            // let user know they have not selected a cheesecake
            alert('You forgot to select a cheesecake...you will be missing out on some great cheesecakes!');
            event.preventDefault();
        }
        else if (this.state.errorLog.length > 0) 
        {
            // setup text for error for the user
            let errorFields = '';

            // loop through errorLog array and format text for user display
            this.state.errorLog.forEach(errorField => {
                errorFields += errorField + '\n';
            })

            // alert user to errors in the form
            alert('Please correct the following information: \n\n' + errorFields);
            event.preventDefault();
        }
        else 
        {
            // information is good lets send the order information to the user and Tiffany
            let contactInfo = this.state.contactInformation;
            let cheesecakes = this.state.cheesecakeOrdered;        

            this.setState({ordered: true});
            event.preventDefault();
            axios.post(`http://localhost:5000/api/send-mail`, { contactInfo: contactInfo, orderedCheesecakes: cheesecakes })
            .then(function (response) 
            {
                // call sign in function
                alert('You submitted the form!');
                
            })
            .catch(function (error) {
                console.log(error);
                
                alert(error);
                        
            });
        }
    }

  
    render() {

        let stateArray = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
        let stateOptions = [];

        stateArray.forEach((state, index) =>
        {
            stateOptions.push(<option value={state} key={index}>{state}</option>)
        });
        
        return(
            <Fragment>
                <Navigation />
                <form onSubmit={this.handleSubmit}>

                    <label className="title">ORDER FORM</label>

                    <label className="subtitle">CONTACT INFORMATION</label>

                    <label htmlFor="firstName" className="first-name">First:</label>
                    <input id="firstName" type="text" onChange={this.handleChange}/>

                    <label htmlFor="lastName" className="last-name">Last:</label>
                    <input id="lastName" type="text" onChange={this.handleChange}/>

                    <label htmlFor="phoneNumber" className="phoneNumber">Phone #:</label>
                    <input id="phoneNumber" type="tel" onChange={this.handleChange}/>

                    <label htmlFor="email" className="email">Email:</label>
                    <input id="email" type="email" onChange={this.handleChange}/>

                    <label htmlFor="address" className="address">Address:</label>
                    <input id="address" type="text" onChange={this.handleChange}/>

                    <label htmlFor="city" className="city">City:</label>
                    <input id="city" type="text" onChange={this.handleChange}/>

                    <label htmlFor="state" className="state">State:</label>
                    <select className="state" id="state" value={this.state.contactInformation.state} onChange={this.handleChange}>
                        { stateOptions }
                    </select>

                    <label htmlFor="zip" className="zip">Zip Code:</label>
                    <input id="zip" type="text" onChange={this.handleChange}/>

                    <label htmlFor="deliveryDate" className="deliveryDate">Delivery Date:</label>
                    <DatePicker
                        selected={this.state.contactInformation.deliveryDate}
                        onChange={date => this.updateDate(date)}
                        minDate={this.state.contactInformation.deliveryDate}
                        withPortal
                        portalId="deliveryDate"
                        placeholderText="Select a delivery date"/>

                    <label className="note">* Only deliver to the following areas in TX: Brazoria, Matagorda, Fort Bend, and Harris Counties</label>
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

                    
                    { this.state.ordered ?  <div className='paymentOption'> <Payment amount={this.state.totalCost} /></div> : <button className="myButton">Submit</button>}

                    
                    
                </form>
                
                <Footer />
                
            </Fragment>
        );
    
    }
  }