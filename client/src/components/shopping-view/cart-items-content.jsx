import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast, useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
    const { user } = useSelector(state => state.auth)

    const dispatch = useDispatch()

    const { toast } = useToast();

    function handleCartItemDelete(getCartItem) {
        // const { userId, productId } = req.params;
        dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem.productId })).then(data => {
            if (data?.payload?.success) {
                toast({
                    title: 'Cart item is deleted successfully'
                })
            }
        })

    }

    function handleUpdateQuantity(getCartItem, typeOfAction) {
        // const { userId, productId, quantity
        // } = req.body;

        dispatch(updateCartQuantity({
            userId: user?.id,
            productId: getCartItem?.productId,
            quantity: typeOfAction === 'plus' ?
                getCartItem?.quantity + 1 : getCartItem?.quantity - 1

        })).then(data => {
            if (data?.payload?.success) {
                toast({
                    title: 'Cart item is updated successfully'
                })
            }
        })
    }
    console.log("cartItem====>", cartItem)
    return <div className="flex items-center space-x-4">
        <img src={cartItem?.image} alt={cartItem?.title} className="w-20 h-20 rounded object-cover" />
        <div className="flex-1">
            <h3 className="font-extrabold">{cartItem?.title}</h3>
            <div className="flex items-center gap-2 mt-1"></div>
            <Button disabled={cartItem?.quantity === 1} onClick={() => handleUpdateQuantity(cartItem, 'minus')} variant="outline" className="h-8 w-8 rounded-full" size="icon">
                <Minus className="w-4 h-4" />

            </Button>

            <span className="font-semibold pl-2">{cartItem?.quantity}</span>

            <Button onClick={() => handleUpdateQuantity(cartItem, 'plus')} variant="outline" className="h-8 w-8 rounded-full ml-2" size="icon">
                <Plus className="w-4 h-4" />

            </Button>
        </div>

        <div className="flex flex-col items-end">

            <p className="font-semibold">
                ${(
                    (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity
                ).toFixed(2)}
            </p>

            <Trash onClick={() => handleCartItemDelete(cartItem)} className="cursor-pointer mt-1" size={20}></Trash>

        </div>

    </div>




}

export default UserCartItemsContent;