// Import supporting files
import React, { Fragment } from "react";
import Navigation from '../navigation';
import Modal from '../modal';

import Cheesecakes from '../../cheesecakes.json';

// Create Navigation component

let cheesecakeMissing = '/img/default_cheesecake_image.png';

export default class OrderPage extends React.Component
{
    constructor(props) 
    {
      super(props);

      let originalCheesecakeArray = Cheesecakes.filter( (cheesecake) => cheesecake.type === "original");
      let fruitCheesecakeArray = Cheesecakes.filter( (cheesecake) => cheesecake.type === "originalFruit");
      let specialtyCheesecakeArray = Cheesecakes.filter( (cheesecake) => cheesecake.type === "specialty");

      this.state = 
      {
        originalCheesecakeArray: originalCheesecakeArray,
        fruitCheesecakeArray: fruitCheesecakeArray,
        specialtyCheesecakeArray: specialtyCheesecakeArray,
        modalCheesecake: null,
        showModal: false
      }

    }

    toggleModal = (event) => 
    {
        let cheesecakeType = event.target.getAttribute('data-cheesecaketype');
        let cheesecakeName = event.target.getAttribute('data-cheesecakename');
        let modalCheesecake = null;

        console.log(event.target.cheesecakename);
        console.log("type: " + cheesecakeType);
        console.log("name: " + cheesecakeName);
        

        if (cheesecakeType === 'original') 
        {
            modalCheesecake = this.state.originalCheesecakeArray.filter( (cheesecake) => cheesecake.name === cheesecakeName);
        }
        else if (cheesecakeType === 'originalFruit') 
        {
            modalCheesecake = this.state.fruitCheesecakeArray.filter( (cheesecake) => cheesecake.name === cheesecakeName);
        }
        else
        {
            modalCheesecake = this.state.specialtyCheesecakeArray.filter( (cheesecake) => cheesecake.name === cheesecakeName);
        }

        console.log("cheesecake selected:");
        console.log(modalCheesecake);
        
        
        
        this.setState({
            showModal: !this.state.showModal, 
            modalCheesecake: modalCheesecake
        })
    };

    render() 
    {
        const { showModal } = this.state;
     
        return(
           <Fragment>
                <Navigation/>
                <div className="collectionTitle">
                <br />
                <br />
                <p>Fruit Cheesecakes</p>
                </div>
                <div className="row">
                {
                    this.state.fruitCheesecakeArray.map((cheesecake, index) => 
                    (
                        <div className="column" key={index}>
                            <div className="imgContainer">
                                <img className="image" src={cheesecake.imagePath} onClick={this.toggleModal} data-cheesecaketype={cheesecake.type} data-cheesecakename={cheesecake.name}/>
                                <div className="middle">
                                    <div className="text" onClick={this.toggleModal} data-cheesecaketype={cheesecake.type} data-cheesecakename={cheesecake.name}>{cheesecake.name}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                </div>
                <div className="collectionTitle">
                    <p>Specialty Cheesecakes</p>
                </div>
                <div className="row">
                {
                    this.state.specialtyCheesecakeArray.map((cheesecake, index) => 
                    (
                        <div className="column" key={index}>
                            <div className="imgContainer">
                                <img className="image" src={cheesecake.imagePath} onClick={this.toggleModal} data-cheesecaketype={cheesecake.type} data-cheesecakename={cheesecake.name}/>
                                <div className="middle">
                                    <div className="text" onClick={this.toggleModal} data-cheesecaketype={cheesecake.type} data-cheesecakename={cheesecake.name}>{cheesecake.name}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                </div>
                
                {
                    showModal ? 
                    (
                       <Modal>
                       <div className="modal">
                            <button type="button" id="modal-close-btn" className="modal-close-btn" onClick={this.toggleModal}><strong>X</strong></button>
                            <div className="modal-info-container">
                                <img className="modal-img" src={this.state.modalCheesecake[0].imagePath} alt="profile picture"/>
                                <p></p>
                                <h3 id="name" className="modal-name cap">{this.state.modalCheesecake[0].name}</h3>
                                <p className="modal-text">Description: </p>
                                <p className="modal-text cap">{this.state.modalCheesecake[0].description}</p>
                                <p className="modal-text">Price: ${this.state.modalCheesecake[0].price} </p>
                            </div>
                        </div>
                       </Modal>
                    ) : null
                }
     
           </Fragment>
        );
     }
}