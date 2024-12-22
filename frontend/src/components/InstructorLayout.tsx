import React, { ReactNode } from "react";
import InstructorHeader from "./InstructorHeader";
import Footer from './Footer';


interface InstructorLayoutProps {
  children: ReactNode;
}

const InstructorLayout: React.FC<InstructorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <InstructorHeader />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>
      
        <Footer />
    </div>
  );
};


export default InstructorLayout;
