// Import supporting files
import React from "react";

// Import supporting components
import Navigation from '../navigation';
import Header from '../header';
import Intro from '../intro';
import Footer from '../footer';

// Create HomePage component

const HomePage = () => {
   
    // Display navigation for the user
    return (
        <div>
            <Navigation />
            <Header />
            <Intro />
            <Footer />
        </div>
    );
}

export default HomePage;