import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI';
import GroceryCard from '../components/GroceryCard';
import api from '../lib/axios';
import EmptyGroceryList from '../components/EmptyGroceryList';
import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router';

const HomePage = () => {
  const [isRateLimited, setRateLimited] = React.useState(false);
  const [groceryLists, setGroceryLists] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchGroceryLists = async () => {
      try {
        const res = await api.get('/groceria');
        console.log(res.data);
        setGroceryLists(res.data);
        setRateLimited(false);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setRateLimited(true);
        } else {
          toast.error("Error fetching grocery lists");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroceryLists();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="container mx-auto px-4 py-8">

        {isLoading && <div className="text-center text-primary py-10">Loading Grocery List...</div>}

        {groceryLists.length === 0 && !isRateLimited && !isLoading && <EmptyGroceryList />}

        {groceryLists.length > 0 && !isRateLimited && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl mb-6">Grocery Lists</h2>
              <Link to="/create" className="btn btn-primary">
                <PlusIcon className="size-5" />
                Create New List
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groceryLists.map((list) => (
                <GroceryCard
                  key={list._id}
                  list={list}
                  setGroceryLists={setGroceryLists}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default HomePage