import React from "react";
import "./ContactForm.css";
import { siteConfig } from "../../data";

const ContactForm = () => {
  const { form } = siteConfig.contact;

  return (
    <div className="contact-form">
      <div className="contact-form-row">
        <div className="contact-form-row-copy-item">
          <p className="primary sm">{form.eyebrow}</p>
        </div>
        <div className="contact-form-row-copy-item">
          <p className="primary sm">{form.scene}</p>
        </div>
        <div className="contact-form-row-copy-item">
          <p className="primary sm">{form.copyright}</p>
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-form-col">
          <div className="contact-form-header">
            <h3>{form.title}</h3>

            <p>
              {form.description}
            </p>
          </div>

          <div className="contact-form-availability">
            <p className="primary sm">{form.availability[0]}</p>
            <p className="primary sm">{form.availability[1]}</p>
          </div>
        </div>

        <div className="contact-form-col">
          <div className="form-item">
            <input type="text" placeholder={form.placeholders.name} />
          </div>

          <div className="form-item">
            <input type="text" placeholder={form.placeholders.email} />
          </div>

          <div className="form-item">
            <textarea type="text" rows={6} placeholder={form.placeholders.message} />
          </div>

          <div className="form-item">
            <button className="btn">{form.submitLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
