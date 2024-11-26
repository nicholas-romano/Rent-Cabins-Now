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
import { useCreateGuest } from "../guests/useCreateGuest";

import Table from "../../ui/Table";
import GuestBookingInfo from "./GuestBookingInfo";
import CabinBookingSummaryRow from "./CabinBookingSummaryRow";
import CabinSelectionDetails from "./CabinSelectionDetails";
import Section from "../../ui/Section";
import H3 from "../../ui/H3";

import { useCreateBooking } from "./useCreateBooking";
import { useEditBooking } from "./useEditBooking";
import { useUpdateFullName } from "../guests/useUpdateFullName";
import { useUpdateEmail } from "../guests/useUpdateEmail";
import { getGuest } from "../../services/apiGuests";
import { useQuery } from "@tanstack/react-query";

function NewBookingSummary({
  searchCriteria,
  selectedCabin,
  isEditSession,
  bookingId,
  oldData,
}) {
  const {
    fullName,
    email,
    numGuests,
    startDate,
    endDate,
    observations,
    hasBreakfast,
  } = searchCriteria;

  let searchEmail;
  let searchFullName;
  if (isEditSession) {
    searchEmail = oldData.guests.email;
    searchFullName = oldData.guests.fullName;
  } else {
    searchEmail = email;
    searchFullName = fullName;
  }

  const { data: guest, error } = useQuery({
    queryKey: ["guests"],
    queryFn: () => getGuest(searchEmail),
  });

  const { isEditingFullName, updateFullName } = useUpdateFullName();
  const { isEditingEmail, updateEmail } = useUpdateEmail();

  const { isCreating: isCreatingGuest, createGuest } = useCreateGuest();
  const { isEditing, editBooking } = useEditBooking();

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

  const [guestBookingInfo, setGuestBookingInfo] = useState([]);
  const [cabinSelectionDetails, setCabinSelectionDetails] = useState([]);
  const [cabinBookingSummary, setCabinBookingSummary] = useState([]);

  const cabinPrice = regularPrice - discount;

  const extrasPrice = hasBreakfast ? numGuests * breakfastPrice * numNights : 0;

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

  function createNewGuest() {
    const newGuest = {
      created_at: getCurrentDateTime(),
      fullName,
      email,
    };

    //Create new guest
    createGuest(newGuest, {
      onSuccess: (data) => {
        createNewBooking(data);
      },
    });
  }

  function getNewBookingDataObj(guestData) {
    const guestId = guestData.id;

    const newBookingObj = {
      created_at: currentDateTime,
      startDate: UTCstartDate,
      endDate: UTCendDate,
      numGuests,
      cabinPrice: regularPrice,
      totalPrice,
      status: "unconfirmed",
      hasBreakfast,
      isPaid: false,
      observations,
      cabinId,
      guestId,
      numNights: numNights,
      extrasPrice,
    };
    return newBookingObj;
  }

  function createNewBooking(guestData) {
    const newBookingData = getNewBookingDataObj(guestData);

    createBooking(newBookingData, {
      onSuccess: (data) => {
        console.log("Booking created successfully.");
        navigate(`/bookings`);
      },
    });
  }

  function updateBooking(guestData) {
    const updatedBookingData = getNewBookingDataObj(guestData);

    editBooking(
      { updatedBookingData, bookingId },
      {
        onSuccess: (data) => {
          console.log("Booking Successfully edited and saved");
          navigate(`/bookings`);
        },
      }
    );
  }

  function onSubmit(e) {
    e.preventDefault();

    const id = guest.id;

    //Check if guest info update:
    if (searchFullName !== fullName) {
      const newFullNameData = fullName;
      updateFullName(
        { newFullNameData, id },
        {
          onSuccess: (data) => {
            console.log("Full name successfully updated and saved");
            //navigate(`/bookings`);
          },
        }
      );
    }
    if (searchEmail !== email) {
      const newEmailData = email;
      updateEmail(
        { newEmailData, id },
        {
          onSuccess: (data) => {
            console.log("Email successfully updated and saved");
            //navigate(`/bookings`);
          },
        }
      );
    }
    //Update booking with new guest:
    if (isEditSession) {
      updateBooking(guest);
    } else {
      //Create New Guest and Booking:
      //Check if guest email already exists:
      if (id) {
        // If guest already exists, create new booking with guest data
        createNewBooking(guest);
      } else {
        // If guest does not already exist, create a new guest and a new booking
        createNewGuest();
      }
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {isEditSession ? (
        <h1>Edit Booking Summary</h1>
      ) : (
        <h1>Create New Booking Summary</h1>
      )}
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
          <Checkbox disabled={true} checked={hasBreakfast}>
            Add Breakfast for an additional ${breakfastPrice} more per guest per
            day.
          </Checkbox>
          <Textarea
            readOnly
            type="text"
            id="observations"
            disabled={true}
            value={observations}
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
        {isEditSession ? (
          <Button type="submit">Save Updated Booking</Button>
        ) : (
          <Button type="submit">Create New Booking</Button>
        )}
      </FormRow>
    </form>
  );
}

export default NewBookingSummary;
