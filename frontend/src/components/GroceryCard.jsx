import { PenSquareIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'
import api from '../lib/axios';
import toast from 'react-hot-toast';

const GroceryCard = ({ list, setGroceryLists }) => {

    const handleDelete = async (e, id) => {
      e.preventDefault();

      if (!window.confirm("Are you sure you want to delete this grocery list?")) {
        return;
      }
      try {
        await api.delete(`/groceria/${id}`);
        setGroceryLists(prevLists => prevLists.filter(item => item._id !== id));
        toast.success("Grocery list deleted successfully");
      } catch (error) {
        console.log("Error deleting grocery list", error);
        toast.error("Failed to delete grocery list");
      }
      
    }

    return (
        <Link to={`/detail/${list._id}`}
        className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D]">
            <div className='card-body'>
                <h3 className="card-title text-base-content font-bold">{list.name}</h3>
                <p className="text-base-content/70 line-clamp-3-">{list.description}</p>
            </div>

                <div className="flex justify-end items-center gap-1 m-4">
                <PenSquareIcon className="size-4" />
                <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={(e) => handleDelete(e, list._id)}
                >
                    <Trash2Icon className="size-4" />
                </button>
                </div>
        </Link>
    )
}

export default GroceryCard