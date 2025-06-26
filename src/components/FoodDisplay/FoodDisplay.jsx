import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category, searchTerm }) => {
  const { food_list } = useContext(StoreContext);

  const filteredList = food_list.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const matchSearch =
      !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))
        ) : (
          <p>No matching items found.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
