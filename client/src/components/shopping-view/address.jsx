import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import { use } from "react";
import AddressCard from "./address-card";


function Address() {

    const initialAddressFormData = {
        address: "",
        city: "",
        phone: "",
        pincode: "",
        notes: "",
    }

    const [formData, setFormData] = useState(initialAddressFormData)

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const { addressList } = useSelector((state) => state.shopAddress);

    function handleManageAddress(event) {
        event.preventDefault();
        console.log(formData);

        dispatch(addNewAddress({
            ...formData,
            userId: user?.id,
        })).then((data) => {
            console.log(data);
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
            }

        })
    }

    // check if all fields are filled or not
    function isFoundValid() {
        return Object.keys(formData)
            .map((key) => formData[key].trim() !== "")
            .every((item) => item);
    }

    console.log("** addressList **", addressList);

    useEffect(() => {
        console.log("useEffect");
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch]);

    return (
        <Card>
            {/* <div>
                Address List
            </div> */}

            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">

                {
                    addressList && addressList.length > 0 ?
                        addressList?.map((singleAddress) =>
                            <AddressCard addressInfo={singleAddress} />) : null
                }

            </div>

            <CardHeader>
                <CardTitle>Address</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <CommonForm formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={"Add Address"}
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFoundValid()}
                />
            </CardContent>

        </Card>
    );
}

export default Address;