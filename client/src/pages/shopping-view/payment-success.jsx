import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";


function PaymentSuccessPage(){

    const navigate = useNavigate();


    return(

        <Card className="p-10">
            <CardHeader>
                <CardTitle className="text-4xl">
                    Payment success!
                </CardTitle>
            </CardHeader>

            <Button className="mt-5" onClick ={() => navigate("/shop/account")}>
                View Orders
            </Button>

        </Card>

    )
}

export default PaymentSuccessPage;