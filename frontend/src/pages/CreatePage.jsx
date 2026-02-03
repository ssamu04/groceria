import { ArrowLeftIcon } from 'lucide-react'; 
import React from 'react'
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import axios from 'axios';
import api from '../lib/axios';

const CreatePage = () => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  const navigate = useNavigate();
  const isDisabled = loading || !name.trim() || !description.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await api.post("/groceria", {
        name,
        description,
      });

      toast.success("Grocery list created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating grocery list", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating grocery lists too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create grocery list");
      }
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Home
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">  
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-2xl">
                    Create New Grocery List
                  </h2>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isDisabled}
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>

                </div>
                  {(!name.trim() || !description.trim()) && (
                    <span className="text-error italic text-xs">*All fields required</span>
                  )}
                <div className="form-control mb-4 flex flex-col">
                  <label className="label my-2">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Grocery List Name"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4 flex flex-col">
                  <label className="label mb-2">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    placeholder="Write your description here..."
                    className="textarea textarea-bordered h-32 w-full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage