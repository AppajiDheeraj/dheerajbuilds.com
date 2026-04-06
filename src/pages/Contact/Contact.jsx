import React from "react";
import "./Contact.css";

import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";

import ReactLenis from "lenis/react";

const Contact = () => {
  return (
    <ReactLenis root>
      <div className="page contact">
        <ContactForm />
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Contact;
