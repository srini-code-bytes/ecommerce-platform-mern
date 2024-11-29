import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment>
            <div className="text-base font-bold">
              <h3>{keyItem}</h3>
            </div>
            <div className="grid gap-2 mt-2">
              {filterOptions[keyItem].map((option) => (
                <Label className="flex items-center gap-2 font-normal">
                   {/* checkbox will be checked based on below checks */}
                  <Checkbox
                    checked={
                      filters &&
                      Object.keys(filters).length > 0 &&
                      filters[keyItem] &&
                      filters[keyItem].indexOf(option.id) > -1
                    }
                    onCheckedChange={() => handleFilter(keyItem, option.id)}
                  />
                  {option.label}
                </Label>
              ))}
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
