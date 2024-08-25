import React from 'react';
import { useRouter } from 'next/router';

interface RestaurantCardProps {
  id: number; // Add ID as a prop
  name: string;
  address: string;
  phoneNumber: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ id, name, address, phoneNumber }) => {
  const router = useRouter();

  const handleModifyClick = () => {
    router.push(`/restaurants/${id}/modify`);
  };
  const handleManageClick = () => {
    router.push(`/restaurants/${id}/manage`);
  };

  return (
    <div className="card flex flex-row justify-between m-3">
      <div className='flex flex-col ml-4 justify-center'>
        <h2>{name}</h2>
        <p>{address}</p>
        <p>{phoneNumber}</p>
      </div>
      <div className='flex flex-col mr-4 justify-center'>
        <button className="btn" onClick={handleModifyClick}>Modify</button>
        <button className="btn" onClick={handleManageClick}>Manage</button>
        <button className="btn">Delete</button>
      </div>
    </div>
  );
};

export default RestaurantCard;
