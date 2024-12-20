import Navbar from './Navbar'
import React from 'react';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black text-white min-h-screen w-full">
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
