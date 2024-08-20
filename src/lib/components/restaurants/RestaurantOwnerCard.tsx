
import React from 'react';

interface RestaurantCardProps {
  name: string;
  address: string;
  phoneNumber: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ name, address, phoneNumber }) => {
  return (
    <div className="card flex flex-row justify-between m-3">
      <div className='flex flex-col ml-4 justify-center'>
        <h2>{name}</h2>
        <p>{address}</p>
        <p>{phoneNumber}</p>
      </div>
      <div className='flex flex-col mr-4 justify-center'>
        <button className="btn">Modify</button>
        <button className="btn">Manage</button>
        <button className="btn">Delete</button>
      </div>
    </div>
  );
};

export default RestaurantCard;
