import React from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      <p className="text-text mt-2">{description}</p>
    </div>
  );
};

export default DashboardCard;