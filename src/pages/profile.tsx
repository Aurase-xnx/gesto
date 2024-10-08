import RestaurantCard from '$/lib/components/restaurants/RestaurantCard';
import RestaurantOwnerCard from '$/lib/components/restaurants/RestaurantOwnerCard';
import { api } from '$/utils/api';
import { Restaurant } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const Profile = () => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const {data: createdRestaurant, mutate: createRestaurant} = api.restaurant.create.useMutation();
    const {data: updatedOwner, mutate: updateOwner} = api.user.updateRoleToOwner.useMutation();
    const {data: getRestaurantsByOwner, refetch } = api.restaurant.getAllByOwner.useQuery();

    type Restaurant = {
        id: number;
        name: string;
        address: string;
        phone: string;
    };

    const handleCreateRestaurant = async (data: Restaurant) => {
        try {
            const response = createRestaurant(data);
            if (createdRestaurant) {
                updateOwner({id: session?.user?.id!});
                setShowForm(false);
                refetch();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!session) {
        return (
            <div className="container mx-auto p-8">
                <p className="text-center text-xl text-red-600">
                    You need to be signed in to view this page.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Profile Page</h1>
            <p className="mb-4">Welcome, {session.user?.name}!</p>

            {!showForm ? (
                <button
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => setShowForm(true)}
                >
                    I own a restaurant
                </button>
            ) : (
                <>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Restaurant Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                required />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address:
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                required />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone:
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                required />
                        </div>
                        <div className="flex space-x-4">

                            
                        </div><button
                        onClick={() => handleCreateRestaurant(formData)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                            Confirm
                        </button>
                        <button
                        type="button"
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => setShowForm(false)}
                    >
                            Cancel
                        </button></>
            )}

            {error && <p className="mt-4 text-red-600">{error}</p>}

<div>
                
                <div className='flex flex-col items-center'>
                <h2 className="text-2xl font-bold mt-8 mb-4">My Restaurants</h2>
                {getRestaurantsByOwner ? (
                            <div className="grid grid-cols-1 gap-4 bg-white p-2 my-3 mx-4 rounded-xl w-1/2">
                                {getRestaurantsByOwner.map((restaurant: Restaurant) => (
                                    <RestaurantOwnerCard 
                                    key={restaurant.id}
                                    id={restaurant.id}
                                    name={restaurant.name}
                                    address={restaurant.address}
                                    phoneNumber={restaurant.phone}/>
                                ))}
                            </div>
                        ) : (
                            <p>No restaurants found.</p>
                        )}
                </div>
</div>
            
        </div>

    );
};

export default Profile;