import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import SectionHeader from './SectionHeader';

const ContactSection = ({ content }) => {
  const [formStatus, setFormStatus] = useState('Send Message');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Sending...');
    try {
      await axios.post(`${config.API_BASE_URL}/messages`, formData);
      setFormStatus('Sent!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('Send Message'), 3000);
    } catch (err) {
      setFormStatus('Error!');
      setTimeout(() => setFormStatus('Send Message'), 3000);
    }
  };

  return (
    <section id="contact">
      <div className="contact-info">
        <SectionHeader label="Get In Touch" titleMain="Let's Create Something" titleHighlight="Remarkable" align="left" />
        <div className="divider"></div>
        <p>{content?.contact?.description || "We're always looking for exciting projects and bold collaborators. Whether you're a filmmaker, brand, or storyteller — reach out and let's make something together."}</p>
        <div className="contact-detail">
          <a href={`mailto:${content?.contact?.email || 'hello@chillumphillum.com'}`}>{content?.contact?.email || 'hello@chillumphillum.com'}</a>
          <a href={`tel:${content?.contact?.phone || '+919999999999'}`}>{content?.contact?.phone || '+91 99999 99999'}</a>
          <a href="#">{content?.contact?.location || 'India'}</a>
        </div>
      </div>
      <form className="contact-form" onSubmit={handleContactSubmit}>
        <div className="form-row">
          <div className="form-group"><label>Name</label><input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/></div>
          <div className="form-group"><label>Email</label><input type="email" placeholder="your@email.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Phone</label><input type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}/></div>
          <div className="form-group"><label>Subject</label><input type="text" placeholder="Project Inquiry" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}/></div>
        </div>
        <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your project..." required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea></div>
        <button className="form-submit" type="submit" style={{ backgroundColor: formStatus === 'Sent!' ? '#2d7a4f' : '', color: formStatus === 'Sent!' ? '#fff' : '' }}>{formStatus}</button>
      </form>
    </section>
  );
};

export default ContactSection;
