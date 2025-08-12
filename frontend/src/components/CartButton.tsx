import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartButtonProps {
  cart: string[];
  courses: any[];
}

const CartButton = ({ cart, courses }: CartButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed md:bottom-6 bottom-16 left-6 z-50">
      <Button
        onClick={() => navigate('/cart', { state: { cart, courses } })}
        className="bg-gradient-to-r from-[#1e3a5f] to-blue-500 text-white rounded-full p-3 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 backdrop-blur-md"
      >
        <ShoppingBag className='icon' size={35} />
        {cart.length > 0 && (
          <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm absolute -top-2 -right-2">
            {cart.length}
          </span>
        )}
      </Button>
    </div>
  );
};

export default CartButton;