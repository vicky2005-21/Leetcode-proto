import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react';
import type { ContactFormData } from '../types';

export default function About() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About JEEnius</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our mission is to make JEE preparation accessible, engaging, and effective for every student.
          Through innovative technology and expert-curated content, we're revolutionizing how students prepare for JEE Mains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
          <div className="prose max-w-none">
            <p>
              At JEEnius, we believe that every student deserves access to high-quality JEE preparation resources.
              Our platform is designed to:
            </p>
            <ul>
              <li>Provide comprehensive coverage of JEE Mains syllabus</li>
              <li>Offer personalized learning paths based on individual progress</li>
              <li>Foster a competitive yet supportive learning environment</li>
              <li>Make learning engaging through gamification and rewards</li>
            </ul>
            <p>
              With our innovative approach to online learning, we're helping thousands of students achieve their dreams
              of securing admission to top engineering colleges.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Why Choose Us?</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Expert-Curated Content</h3>
              <p className="text-gray-600">
                Our problems and solutions are crafted by experienced JEE educators and toppers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Adaptive Learning</h3>
              <p className="text-gray-600">
                Our platform adapts to your learning pace and style, providing personalized recommendations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Community Support</h3>
              <p className="text-gray-600">
                Join a community of motivated students and learn together through peer support.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="space-y-6">
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">support@jeenius.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">+91 123 456 7890</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-gray-600">123 Education Street, Learning Hub, India</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Send Message
            </button>
            {submitted && (
              <div className="text-green-600 text-center mt-4">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-8">Our Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {['IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur'].map((partner) => (
            <div key={partner} className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold">{partner}</h3>
              <p className="text-gray-600 text-sm mt-2">Educational Partner</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}