// Import supporting files
import React from "react";

// Create Footer component

const Footer = () => {
   
    // Display footer for the user
    return (
        <div className="footer">
            <div>
                <div><b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Phone:</b><p>&nbsp;&nbsp;(979)-201-3200</p></div>
                <div><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email:</b> <p>&nbsp;&nbsp;tastefullytiffanyscheesecakes@gmail.com</p></div> 
            </div>
            <a className='icons' href='https://www.facebook.com/tastefullytiffanyscheesecakes' target="_blank"><img src="/img/f_logo_RGB-Black_58.png"></img></a>
            <a href='https://www.instagram.com/tastefullytiffanyscheesecakes/?igshid=fmhozwz40qcs' target="_blank"><img src="/img/glyph-logo_May2016.png"></img></a>
        </div>
    );
}

export default Footer;