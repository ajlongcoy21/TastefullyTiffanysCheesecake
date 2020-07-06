import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";

class Payment extends React.Component 
{
    constructor( props ) 
    {
            super( props );
            // We create an element div for this modal
            this.purchaseAmount = props.amount;
    }

    // We append the created div to the div#modal
    componentDidMount() 
    {
    }

    componentWillUnmount() 
    {
    }

    render() 
    {
        return (
            <PayPalButton
                amount={this.purchaseAmount}
                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                onSuccess={(details) => {
                    
                    console.log(details);
                    alert("Transaction completed by " + details);

                    // OPTIONAL: Call your server to save the transaction
                    // return fetch("/paypal-transaction-complete", {
                    //     method: "post",
                    //     body: JSON.stringify({
                    //         orderID: data.orderID
                    //     })
                    // });
                }}
            />
        );
    }
}
export default Payment;