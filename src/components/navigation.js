// Import supporting files
import React from "react";
import { Link } from 'react-router-dom'; // import Link for router

// Create Navigation component

const Navigation = () => {
   
    // Display navigation for the user
    return (
        <div className="navigation">
            <ul>
                <li className="active"><Link to="/">Home</Link></li>
                <li><Link to="/cheesecakes">Cheesecakes</Link></li>
                <li><Link to="/placeorder">Order</Link></li>
            </ul>
        </div>
    );
}

export default Navigation;