

// Page to be displayed when they hit the Continue with Review Order button on paypal payment page

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
        console.log("paymentId===>", paymentId)
        console.log("payerId===>", payerId)
        if (paymentId && payerId) {
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

            console.log("orderId====>", orderId)



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
                Processing Payment...
            </CardTitle>
        </CardHeader>
    </Card>
}

export default PaypalReturnPage;