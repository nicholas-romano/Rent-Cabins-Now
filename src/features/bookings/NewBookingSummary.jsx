import styled from "styled-components";
import { useSettings } from "../settings/useSettings";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import FormRow from "../../ui/FormRow";
import {
  getCurrentDateTime,
  getDate,
  getLengthOfStay,
  getUTCDate,
} from "../../utils/helpers";
import Checkbox from "../../ui/Checkbox";
import Textarea from "../../ui/Textarea";
import { useEffect, useState } from "react";
import { useGuest } from "../guests/useGuest";
import { useCreateGuest } from "../guests/useCreateGuest";
import { useCreateBooking } from "./useCreateBooking";
import Table from "../../ui/Table";
import GuestBookingInfo from "./GuestBookingInfo";
import CabinBookingSummaryRow from "./CabinBookingSummaryRow";
import CabinSelectionDetails from "./CabinSelectionDetails";

const Section = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  background-color: #ddd;
  padding: 15px;
  border-radius: 10px;
`;

const H3 = styled.h3`
  margin-bottom: 20px;
`;

function NewBookingSummary({ searchCriteria, selectedCabin }) {
  const { isCreating: isCreatingGuest, createGuest } = useCreateGuest();
  const {
    isLoading: isLoadingGuest,
    error,
    guest,
  } = useGuest(searchCriteria.email);

  const { isCreating: isCreatingBooking, createBooking } = useCreateBooking();

  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();
  const navigate = useNavigate();

  const { fullName, email, numGuests, startDate, endDate } = searchCriteria;

  const {
    id: cabinId,
    name: cabinName,
    image,
    description,
    maxCapacity,
    regularPrice,
    discount,
  } = selectedCabin;

  const currentDateTime = getCurrentDateTime();
  const UTCstartDate = getUTCDate(getDate(startDate));
  const UTCendDate = getUTCDate(getDate(endDate));
  const numNights = getLengthOfStay(startDate, endDate);

  const [addBreakfast, setAddBreakfast] = useState(false);
  const [observations, setObservations] = useState(null);
  const [guestBookingInfo, setGuestBookingInfo] = useState([]);
  const [cabinSelectionDetails, setCabinSelectionDetails] = useState([]);
  const [cabinBookingSummary, setCabinBookingSummary] = useState([]);

  const cabinPrice = regularPrice - discount;

  const extrasPrice = addBreakfast ? numGuests * breakfastPrice * numNights : 0;

  const totalPrice = numNights * cabinPrice + extrasPrice;

  useEffect(() => {
    setGuestBookingInfo([{ fullName, email, numGuests }]);
    setCabinSelectionDetails([
      { cabinId, cabinName, image, description, maxCapacity },
    ]);
    setCabinBookingSummary([
      {
        cabinId,
        startDate,
        endDate,
        numNights,
        cabinPrice,
        extrasPrice,
        totalPrice,
      },
    ]);
  }, [
    fullName,
    email,
    cabinId,
    cabinName,
    image,
    description,
    maxCapacity,
    startDate,
    endDate,
    cabinPrice,
    numGuests,
    numNights,
    extrasPrice,
    totalPrice,
  ]);

  function getCreateGuest() {
    if (guest.details === "The result contains 0 rows") {
      const newGuest = {
        created_at: getCurrentDateTime(),
        fullName,
        email,
      };

      createGuest(newGuest, {
        onSuccess: (data) => {
          createNewBooking(data);
        },
      });
    } else {
      createNewBooking();
    }
  }

  function createNewBooking(newGuest) {
    const guestId = newGuest ? newGuest.id : guest.id;
    //Create New Booking
    const newBooking = {
      created_at: currentDateTime,
      startDate: UTCstartDate,
      endDate: UTCendDate,
      numGuests,
      cabinPrice: regularPrice,
      totalPrice,
      status: "unconfirmed",
      hasBreakfast: addBreakfast,
      isPaid: false,
      observations,
      cabinId,
      guestId,
      numNights: numNights,
      extrasPrice,
    };

    createBooking(newBooking, {
      onSuccess: (data) => {
        console.log("Booking created successfully.");
        navigate(`/bookings`);
      },
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    getCreateGuest();
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Create Booking</h1>
      <Section>
        <H3>Guest Info</H3>
        <Table columns="auto auto auto">
          <Table.Header>
            <div>Name</div>
            <div>Email</div>
            <div>Number of Guests</div>
          </Table.Header>

          <Table.Body
            data={guestBookingInfo}
            render={(guestBookingInfo) => (
              <GuestBookingInfo
                key={guestBookingInfo.email}
                guestBookingInfo={guestBookingInfo}
              />
            )}
          />
        </Table>
      </Section>
      <Section>
        <H3>Cabin Details</H3>
        <Table columns="auto auto auto">
          <Table.Header>
            <div>Cabin {cabinName}</div>
            <div>Description</div>
            <div></div>
          </Table.Header>

          <Table.Body
            data={cabinSelectionDetails}
            render={(cabinSelectionDetails) => (
              <CabinSelectionDetails
                key={cabinSelectionDetails.cabinId}
                cabinSelectionDetails={cabinSelectionDetails}
              />
            )}
          />
        </Table>
      </Section>
      <Section>
        <H3>Cost Summary</H3>
        <Table columns="auto auto auto auto">
          <Table.Header>
            <div>Cabin Cost/night</div>
            <div># Nights</div>
            <div>Breakfast added</div>
            <div>Total</div>
          </Table.Header>

          <Table.Body
            data={cabinBookingSummary}
            render={(cabinBookingSummary) => (
              <CabinBookingSummaryRow
                key={cabinBookingSummary.cabinId}
                cabinBookingSummary={cabinBookingSummary}
              />
            )}
          />
        </Table>
      </Section>
      <Section>
        <H3>Extras</H3>
        <FormRow>
          <Checkbox
            onChange={() => setAddBreakfast(!addBreakfast)}
            checked={addBreakfast}
          >
            Add Breakfast for an additional ${breakfastPrice} more per guest per
            day.
          </Checkbox>
          <Textarea
            type="text"
            id="observations"
            onChange={(e) => setObservations(e.target.value)}
            defaultValue=""
          />
          <label>
            Tell us anything you think we should know about your upcoming stay
            in the box to the left.
          </label>
        </FormRow>
      </Section>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => {
            navigate(`/bookings/`);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Book Cabin</Button>
      </FormRow>
    </form>
  );
}

export default NewBookingSummary;
