import styled from "styled-components";
import { useSettings } from "../settings/useSettings";
import Button from "../../ui/Button";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate } from "react-router-dom";
import FormRow from "../../ui/FormRow";
import {
  formatCurrency,
  getCurrentDateTime,
  getDate,
  getLengthOfStay,
  getUTCDate,
} from "../../utils/helpers";
import Input from "../../ui/Input";
import Checkbox from "../../ui/Checkbox";
import Textarea from "../../ui/Textarea";
import { useRef, useState } from "react";
import { useGuest } from "../guests/useGuest";
import { useCreateGuest } from "../guests/useCreateGuest";
import { useCreateBooking } from "./useCreateBooking";

const Img = styled.img`
  display: block;
  width: 150px;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
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
  const moveBack = useMoveBack();

  const [addBreakfast, setAddBreakfast] = useState(false);
  const [observations, setObservations] = useState(null);

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
  const lengthOfStay = getLengthOfStay(startDate, endDate);

  const totalPrice = regularPrice - discount + breakfastPrice * lengthOfStay;

  const extrasPrice = breakfastPrice * lengthOfStay;

  function getCreateGuest() {
    if (guest.details === "The result contains 0 rows") {
      const newGuest = {
        created_at: getCurrentDateTime(),
        fullName,
        email,
      };

      createGuest(newGuest, {
        onSuccess: (data) => {
          console.log("guest data: ", data);
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
      numNights: lengthOfStay,
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

  function onError(errors) {
    console.log(errors);
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Create Booking</h1>
      <FormRow label="Guest Name">
        <Input
          type="text"
          readOnly
          id="guestName"
          name="guestName"
          value={fullName}
          disabled={true}
        />
      </FormRow>
      <FormRow label="Email">
        <Input
          type="text"
          readOnly
          id="email"
          name="email"
          value={email}
          disabled={true}
        />
      </FormRow>
      <FormRow label="Number of Guests">
        <Input
          type="text"
          readOnly
          id="numGuests"
          name="numGuests"
          value={numGuests}
          disabled={true}
        />
      </FormRow>
      <h3>Dates:</h3>
      <FormRow>
        <div>
          From:
          <Input
            type="text"
            readOnly
            id="startDate"
            name="startDate"
            value={getDate(startDate)}
            disabled={true}
          />
        </div>
        <div>
          To:
          <Input
            type="text"
            readOnly
            id="endDate"
            name="endDate"
            value={getDate(endDate)}
            disabled={true}
          />
        </div>
      </FormRow>
      <FormRow>
        <h3>Cabin Selected: {cabinName}</h3>
      </FormRow>
      {addBreakfast ? (
        <FormRow>
          Total Price:{" "}
          {formatCurrency(
            regularPrice - discount + breakfastPrice * lengthOfStay
          )}
        </FormRow>
      ) : (
        <FormRow>
          Total Price: {formatCurrency(regularPrice - discount)}
        </FormRow>
      )}
      <FormRow>Length of Stay: {lengthOfStay} nights.</FormRow>
      <FormRow>Max Capacity: {maxCapacity}</FormRow>
      <FormRow>
        <Img src={image} alt={`Cabin ${cabinName}`} />
        <p>{description}</p>
      </FormRow>
      <FormRow>
        <Checkbox
          onChange={() => setAddBreakfast(!addBreakfast)}
          checked={addBreakfast}
        >
          Add Breakfast for an additional ${breakfastPrice} more per day.
        </Checkbox>
      </FormRow>
      <FormRow label="Tell us anything you think we should know about your upcoming stay.">
        <Textarea
          type="text"
          id="observations"
          onChange={(e) => setObservations(e.target.value)}
          defaultValue=""
        />
      </FormRow>
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
