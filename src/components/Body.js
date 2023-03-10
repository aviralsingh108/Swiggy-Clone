import RestaurantCard from "./RestaurantCard";
import { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import { filterData } from "../utils/helper";
import useOnline from "../utils/useOnline";
import UserContext from "../utils/UserContext";
import { FETCH_MENU_URL_HOME } from "../config";
const Body = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filterRestaurants, setFilterRestaurants] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    getRestaurants();
  }, []);

  async function getRestaurants() {
    const data = await fetch(FETCH_MENU_URL_HOME);
    const json = await data.json();
    setRestaurants(json?.data?.cards[2]?.data?.data?.cards);
    setFilterRestaurants(json?.data?.cards[2]?.data?.data?.cards);
  }
  const isOnline = useOnline();

  if (!isOnline) {
    return <h1>🔴 You are offline, please check your Internet Connection!</h1>;
  }

  return restaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <>
      <div className="p-5 m-2 my-5 bg-purple-200">
        <input
          data-testid="search-input"
          className="p-2 m-2 focus:bg-cyan-50 rounded-md w-60"
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <button
          data-testid="search-btn"
          className="p-2 m-2 bg-amber-400 hover:bg-amber-500 text-white rounded-md"
          onClick={() => {
            const data = filterData(searchInput.toLowerCase(), restaurants);
            setFilterRestaurants(data);
          }}
        >
          Search
        </button>
        <input
          value={user.name}
          onChange={(e) =>
            setUser({
              ...user,
              name: e.target.value,
            })
          }
        ></input>
        <input
          value={user.email}
          onChange={(e) =>
            setUser({
              ...user,
              email: e.target.value,
            })
          }
        ></input>
      </div>
      <div data-testid="res-list" className="flex flex-wrap m-4">
        {filterRestaurants.map((item) => (
          <Link to={"/restaurant/" + item.data.id} key={item.data.id}>
            <RestaurantCard {...item.data} key={item.data.id} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Body;
