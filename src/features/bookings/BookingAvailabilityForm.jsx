import { useAvailableCabins } from "../cabins/useAvailableCabins";
import Spinner from "../../ui/Spinner";
import CabinRow from "../cabins/CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";
import { getDate } from "../../utils/helpers";
import Button from "../../ui/Button";

function BookingAvailabilityForm({
  searchCriteria,
  showNewBookingSummary,
  showBookingAvailabiltyForm,
  selectedCabin,
  setSelectedCabin,
}) {
  const { isLoading, error, cabins } = useAvailableCabins(searchCriteria);

  const select = true;

  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!cabins?.length) return <Empty resourceName="cabins" />;

  // 1) Filter
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;
  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  }

  if (filterValue === "with-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
  }

  // 2) Sort
  const sortBy = searchParams.get("sortBy") || "startDate-asc";

  const [field, direction] = sortBy.split("-");

  const modifier = direction === "asc" ? 1 : -1;

  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  function handleSearchQuery() {
    showNewBookingSummary(true);
  }

  return (
    <div>
      <h3>
        Select one available cabin from the list below based on your search
        criteria:
      </h3>

      <p>
        <span>Dates: </span>
        {getDate(searchCriteria.startDate)} - {getDate(searchCriteria.endDate)}
      </p>
      <p>Total Guests: {searchCriteria.numGuests}</p>

      <Menus>
        <Table columns="0.8fr 1.8fr 2.2fr 1fr 1fr 1fr">
          <Table.Header>
            <div>Select</div>
            <div>Image</div>
            <div>Cabin</div>
            <div>Capacity</div>
            <div>Cost Per Day</div>
            <div>Discount</div>
          </Table.Header>
          <Table.Body
            data={sortedCabins}
            render={(cabin) => (
              <CabinRow
                select={select}
                setSelectedCabin={setSelectedCabin}
                cabin={cabin}
                key={cabin.id}
              />
            )}
          />
        </Table>

        {selectedCabin && (
          <div>
            <Button
              variation="secondary"
              onClick={() => showBookingAvailabiltyForm(false)}
              type="reset"
            >
              Cancel
            </Button>
            <Button onClick={handleSearchQuery}>Cabin Booking Summary</Button>
          </div>
        )}
      </Menus>
    </div>
  );
}

export default BookingAvailabilityForm;
