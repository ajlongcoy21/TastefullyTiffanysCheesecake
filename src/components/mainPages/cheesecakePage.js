// Import supporting files
import React, { Fragment } from "react";
import axios from "axios";
import Navigation from '../navigation';
import Footer from '../footer';
import Modal from '../modal';

// Create CheesecakePage component

export default class CheesecakePage extends React.Component
{
    /*
        Constructor - this contstructor helps setup the state for the component.

        cheesecakeTypes - array of types of cheesecakes from the database. Consists of 3 properties
              index: Integer - index in database
               type: String - description of the group of cheesecakes
              price: Integer - general price of cheesecake group

        cheeecakes - array of cheesecakes from the database. Consists of 8 properties
                  index: Integer - index in database
                   type: Integer - relational value to cheesecakeTypes index
                  fruit: String - optional string describing fruit
              specialty: String - optional string describing specialty
                   name: String - name of cheesecake
            description: String - description of cheesecake
               adjprice: Integer - adjustable value to add value to cheesecake
                  image: Blob - image for cheesecake

        typesAreLoaded - boolean to indicate the cheesecake types were retrieved from the database
        cheesecakesAreLoaded - boolean to indicate the cheesecakes were retrieved from the database
        error - boolean to idicate an error occured during retrieving data
        modalCheesecake - holds a cheesecake object for display in the modal
        showModal - boolean to control the display of cheesecake modal popup
    */

    constructor(props) 
    {
      super(props);

      this.state = 
      {
        cheesecakeTypes: null,
        cheesecakes: null,
        typesAreLoaded: false,
        cheesecakesAreLoaded: false,
        error: false,
        modalCheesecake: null,
        showModal: false
      }

    }

    /**************************************************************************************************************
        componentDidMount
        parameters: N/A
        Return: N/A

        description: The componentDidMount function is used to makes calls to the database for the types of cheesecakes
                     and the cheesecakes. If successful it will update the following information in the state:

                     cheesecakeTypes, cheesecakes, typesAreLoaded, cheesecakesAreLoaded
    **************************************************************************************************************/

    componentDidMount()
    {
        var self = this;

        // Make a call to the api for the complete list of cheesecake types
        // http://localhost:5000/
        // https://ttcapi.azurewebsites.net
        axios.get(`https://ttcapi.azurewebsites.net/api/cheesecake-types`)
        .then(response => {
                        
            // Set the state on successful return of cheesecake types data
            this.setState({
                typesAreLoaded: true,             // data is loaded
                cheesecakeTypes: response.data    // set the cheesecakeTypes state variable to the response data
            });
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

        // Make a call to the api for the complete list of cheesecakes
        axios.get(`https://ttcapi.azurewebsites.net/api/cheesecakes`)
        .then(response => {
            
            // Set the state on successful return of cheesecake data
            this.setState({
                cheesecakesAreLoaded: true,   // data is loaded
                cheesecakes: response.data    // set the cheesecakes state variable to the response data
            });
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
        toggleModal
        parameters: event
        Return: N/A

        description: The toggleModal function takes an event and gets cheesecake data from the target clicked.
                     With the cheesecake name, it loops though the state cheesecakes array looking for a match.
                     if a match is found, the cheesecake object is set to the modal object and the modal is
                     displayed.
    **************************************************************************************************************/

    toggleModal = (event) => 
    {
        // obtain the cheesecake name from event target
        let cheesecakeName = event.target.getAttribute('data-cheesecakename');
        let modalCheesecake = null;

        // setup modalCheesecake with a cheesecake object from the cheesecakes array
        modalCheesecake = this.state.cheesecakes.filter( cheesecake => cheesecake.name === cheesecakeName);
        
        // update state with new modal and toggle the modal to show
        this.setState({
            showModal: !this.state.showModal, 
            modalCheesecake: modalCheesecake
        })
    };

    render() 
    {
        // Get necessary state variables
        const { error, typesAreLoaded, cheesecakesAreLoaded, cheesecakes, cheesecakeTypes, showModal } = this.state;

        // If we have the server response status of 500, redirect to error page
        if (error) 
        {
            //return <Redirect to='/error'/>;
        } 
        // If we are waiting for the data to load...notify the user
        else if (!typesAreLoaded || !cheesecakesAreLoaded) 
        {
            return (
                <Fragment>
                    <Navigation />
                    <div>Loading...</div>
                </Fragment>
            )
            
        } 
        else
        {
            return(
                <Fragment>
                     <Navigation/>
                     {
                         cheesecakeTypes.map( (type) => (

                                <div key={type.index}>
                                    <div className="collectionTitle">
                                        <br />
                                        <br />
                                        <p>{type.type[0].toUpperCase() + type.type.substring(1) + " Cheesecakes"}</p>
                                    </div>
                                    <div className="row">
                                        {
                                            type.Cakes.map( (cake) => (
                                                <div className="column" key={cake.index}>
                                                    <div className="imgContainer">
                                                        <img className="image" src={cake.image} onClick={this.toggleModal} data-cheesecaketype={cake.type} data-cheesecakename={cake.name} data-cheesecakeindex={cake.index}/>
                                                        <div className="middle">
                                                            <div className="text" onClick={this.toggleModal} data-cheesecaketype={cake.type} data-cheesecakename={cake.name} data-cheesecakeindex={cake.index}>{cake.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                         ))
                     }             
                     {
                         showModal ? 
                         (
                            <Modal>
                            <div className="modal">
                                 <button type="button" id="modal-close-btn" className="modal-close-btn" onClick={this.toggleModal}><strong>X</strong></button>
                                 <div className="modal-info-container">
                                     <img className="modal-img" src={this.state.modalCheesecake[0].image} alt="profile picture"/>
                                     <p></p>
                                     <h3 id="name" className="modal-name cap">{this.state.modalCheesecake[0].name}</h3>
                                     <p className="modal-text">Description: </p>
                                     <p className="modal-text cap">{this.state.modalCheesecake[0].description}</p>
                                     <p className="modal-text">Price: ${this.state.modalCheesecake[0].adjprice + this.state.modalCheesecake[0].Type.price} </p>
                                 </div>
                             </div>
                            </Modal>
                         ) : null
                     }
                     <Footer/>
          
                </Fragment>
             );
        }
     }
}