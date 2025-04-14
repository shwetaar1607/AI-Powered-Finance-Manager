import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-finance-dark text-white py-6 mt-auto">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Footer Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          {/* About Section */}
          <div>
            <h2 className="text-lg font-semibold">Finance Manager</h2>
            <p className="text-gray-300 text-sm mt-2">
              Your AI-powered financial assistant, helping you make smarter financial decisions.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h2 className="text-lg font-semibold">Quick Links</h2>
            <ul className="mt-2 space-y-2">
              <li><a href="/dashboard" className="text-gray-300 hover:text-finance-primary">Dashboard</a></li>
              <li><a href="/budget" className="text-gray-300 hover:text-finance-primary">Budgeting</a></li>
              <li><a href="/investments" className="text-gray-300 hover:text-finance-primary">Investments</a></li>
              <li><a href="/support" className="text-gray-300 hover:text-finance-primary">Support</a></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h2 className="text-lg font-semibold">Follow Us</h2>
            <div className="flex justify-center md:justify-start gap-4 mt-2">
              <a href="#" className="text-gray-300 hover:text-finance-primary text-xl"><FaFacebookF /></a>
              <a href="#" className="text-gray-300 hover:text-finance-primary text-xl"><FaTwitter /></a>
              <a href="#" className="text-gray-300 hover:text-finance-primary text-xl"><FaLinkedinIn /></a>
              <a href="#" className="text-gray-300 hover:text-finance-primary text-xl"><FaInstagram /></a>
            </div>
          </div>
          
        </div>

        {/* Copyright Section */}
        <div className="mt-6 text-center text-gray-400 text-sm border-t border-gray-600 pt-4">
          &copy; {new Date().getFullYear()} Finance Manager. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
