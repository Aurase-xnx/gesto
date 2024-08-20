import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Restaurant() {
    const {query} = useRouter();
    const restaurantId = query;
    console.log("Restaurantid",query);
    const { data: sessionData } = useSession();
    const { data: getOneRestaurant } = api.restaurant.getOne.useQuery({id: restaurantId});

    return (
        <div>
            <h1>Restaurant</h1>
            <div>
                {getOneRestaurant ? (
                    <div>
                        <h2>{getOneRestaurant.name}</h2>
                        <p>{getOneRestaurant.address}</p>
                        <p>{getOneRestaurant.phone}</p>
                    </div>
                ) : (
                    <p>Loading restaurant...</p>
                )}
                </div>
        </div>
    );
}