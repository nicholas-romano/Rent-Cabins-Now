import AddCabin from "./AddCabin";
import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  return (
    <TableOperations>
      <AddCabin />
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (a-z)" },
          { value: "name-desc", label: "Sort by name (z-a)" },
          { value: "regularPrice-asc", label: "Sort by price (low)" },
          { value: "regularPrice-desc", label: "Sort by price (high)" },
          { value: "maxCapacity-asc", label: "Sort by max capacity (low)" },
          { value: "maxCapacity-desc", label: "Sort by max capacity (high)" },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
