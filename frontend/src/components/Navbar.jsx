import { ShoppingCartIcon } from 'lucide-react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <header className='bg-base-300 border-b border-base-content/10'>
        <div className='mx-auto max-w-6xl p-4 flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-primary'>Groceria</h1>
            <div className='flex items-center gap-4'>
                {/* Edit Link to proper route */}
                <Link to="/create" className='btn btn-primary btn-sm mr-2'>
                <ShoppingCartIcon className='size-5'/>
                <span>Your Cart</span>
                </Link>
            </div>
        </div>
    </header>
  )
}

export default Navbar