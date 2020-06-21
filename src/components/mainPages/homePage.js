// Import supporting files
import React from "react";

import Navigation from '../navigation';
import Header from '../header';
import Intro from '../intro';

// Create Navigation component

const HomePage = () => {
   
    // Display navigation for the user
    return (
        <div>
            <Navigation />
            <Header />
            <Intro />
        </div>
    );
}

export default HomePage;