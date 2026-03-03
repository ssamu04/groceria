import { Link } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import React from 'react'

const CartPage = () => {
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
              
                
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage