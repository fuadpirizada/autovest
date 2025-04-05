import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700 mb-4">
              AutoVest
            </div>
            <p className="text-gray-400 mb-4">
              Premium car investment platform offering high-yield returns on luxury vehicle portfolios.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors">Investments</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Cars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-lg mb-4">Legal</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Risk Disclosure</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AML Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-lg mb-4">Contact Us</h5>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fa-solid fa-envelope w-5 text-amber-500"></i>
                <span className="text-gray-400 ml-2">support@autovest.com</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-phone w-5 text-amber-500"></i>
                <span className="text-gray-400 ml-2">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-location-dot w-5 text-amber-500"></i>
                <span className="text-gray-400 ml-2">123 Finance Street, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} AutoVest. All rights reserved.</p>
          <div className="flex space-x-4">
            <div className="bg-gray-800 rounded px-2 py-1 text-xs">Visa</div>
            <div className="bg-gray-800 rounded px-2 py-1 text-xs">Mastercard</div>
            <div className="bg-gray-800 rounded px-2 py-1 text-xs">PayPal</div>
            <div className="bg-gray-800 rounded px-2 py-1 text-xs">Bitcoin</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
