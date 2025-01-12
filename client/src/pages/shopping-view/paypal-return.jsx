// Page to be displayed when they hit the "Continue with Review Order" button on paypal payment page
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";


function PaypalReturnPage() {

    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    useEffect(() => {
        if (paymentId && payerId) {
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
            dispatch(capturePayment({ payerId, paymentId, orderId })).then((data) =>
            {
                if(data?.payload?.success){
                    sessionStorage.removeItem('currentOrderId')
                    window.location.href = '/shop/payment-success';
                }
            }
            )
        }

    }, [paymentId, payerId, dispatch])

    return <Card>
        <CardHeader>
            <CardTitle>
                Good news, processing Payment...
            </CardTitle>
        </CardHeader>
    </Card>
}

export default PaypalReturnPage;