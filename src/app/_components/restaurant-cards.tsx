import Link from "next/link";

export default function RestaurantCards() {
  return (
    <div className="card card-side mx-5 my-3 bg-base-100 shadow-xl">
      <figure>
        <img
          src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
          alt="Movie"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Restaurant X</h2>
        <p>Food from the beautiful country of x</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Make a reservation</button>
        </div>
      </div>
    </div>
  );
}
