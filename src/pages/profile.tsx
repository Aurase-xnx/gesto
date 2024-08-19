import { api } from '$/utils/api';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const Profile = () => {
    const { data: session } = useSession();
    console.log(session?.user)
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
        <div className="container mx-auto p-20">
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
                        onClick={() => createRestaurant(formData)}
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
        </div>
    );
};

export default Profile;