
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";



function AdminOrderDetailsView() {

    return (
        <DialogContent className="sm:max-w-[600px] bg-white">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex items-center justify-between">

                        <p className="font-medium">Order ID</p>
                        <Label>
                            123456
                        </Label>
                    </div>


                </div>
            </div>

        </DialogContent>
    );
}

export default AdminOrderDetailsView;