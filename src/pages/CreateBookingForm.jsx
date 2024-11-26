import Input from "../ui/Input";
import Form from "../ui/Form";
import Button from "../ui/Button";
import FormRow from "../ui/FormRow";
import { useForm } from "react-hook-form";
import { DatePickerField } from "../ui/DatePickerField";
import { useEffect, useState } from "react";
import BookingAvailabilityForm from "../features/bookings/BookingAvailabilityForm";
import NewBookingSummary from "../features/bookings/NewBookingSummary";
import H1 from "../ui/H1";
import Checkbox from "../ui/Checkbox";
import { useLocation } from "react-router-dom";
import { useSettings } from "../features/settings/useSettings";
import Textarea from "../ui/Textarea";

function CreateBookingForm() {
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();

  const [searchCriteria, setSearchCriteria] = useState();

  const [selectedCabin, setSelectedCabin] = useState();
  const [bookingAvailabilityForm, showBookingAvailabiltyForm] = useState(false);

  const [newBookingSummary, showNewBookingSummary] = useState(false);

  const [error, setError] = useState("");
  const [resetForm, setResetForm] = useState(false);

  const location = useLocation();
  let bookingToEdit = location.state;

  if (bookingToEdit === null) {
    bookingToEdit = {};
  }

  const { id: editId, ...editValues } = bookingToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, control, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (searchCriteria) {
      showBookingAvailabiltyForm(true);
      setHasBreakfast(isEditSession ? editValues.hasBreakfast : hasBreakfast);
    } else {
      showBookingAvailabiltyForm(false);
    }
  }, [searchCriteria, editValues, hasBreakfast, isEditSession]);

  function onError(errors) {
    console.log("errors: ", errors);
  }

  function onSubmit(data) {
    if (data.startDate > data.endDate) {
      setError("Start date must be earlier than end date.");
    } else {
      setError("");
      showBookingAvailabiltyForm(false);

      const newData = {
        ...data,
        hasBreakfast,
      };
      setSearchCriteria(newData);
    }
  }

  const checkboxHandler = () => {
    setHasBreakfast(!hasBreakfast);
  };

  return (
    <>
      {newBookingSummary ? (
        <NewBookingSummary
          searchCriteria={searchCriteria}
          selectedCabin={selectedCabin}
          isEditSession={isEditSession}
          bookingId={isEditSession ? bookingToEdit.id : undefined}
          oldData={bookingToEdit}
        />
      ) : (
        <>
          {isEditSession ? <H1>Edit Booking</H1> : <H1>Create New Booking</H1>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow label="Name" error={errors?.name?.message}>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                defaultValue={isEditSession ? editValues.guests.fullName : ""}
                {...register("fullName", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow label="Email address" error={errors?.email?.message}>
              <Input
                type="email"
                id="email"
                name="email"
                defaultValue={isEditSession ? editValues.guests.email : ""}
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please provide a valid email address.",
                  },
                })}
              />
            </FormRow>
            {isEditSession ? (
              <FormRow label="Selected Cabin">
                <Input
                  readOnly
                  disabled={true}
                  value={editValues.cabins.name}
                />
              </FormRow>
            ) : (
              ""
            )}
            <FormRow
              label="Number of Guests"
              error={errors?.numGuests?.message}
            >
              <Input
                type="number"
                id="numGuests"
                {...register("numGuests", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "Number of guests must be at least 1",
                  },
                })}
              />
            </FormRow>
            <FormRow label="Start Date">
              <DatePickerField
                control={control}
                name="startDate"
                placeholder="Start Date"
                resetForm={resetForm}
                setResetForm={setResetForm}
              />
            </FormRow>
            <FormRow label="End Date">
              <DatePickerField
                control={control}
                name="endDate"
                placeholder="End Date"
                resetForm={resetForm}
                setResetForm={setResetForm}
              />
            </FormRow>
            <FormRow
              label={`Add Breakfast for an additional $${breakfastPrice} more per guest
                per day.`}
            >
              <Checkbox
                id="hasBreakfast"
                name="hasBreakfast"
                onChange={checkboxHandler}
                defaultChecked={hasBreakfast}
              />
            </FormRow>
            <FormRow>
              <Textarea
                type="text"
                id="observations"
                name="observations"
                onChange={(e) => setObservations(e.target.value)}
                defaultValue={isEditSession ? editValues.observations : ""}
                {...register("observations", {
                  pattern: {
                    value: /\S+/,
                    message: "Can only have alphanumeric characters.",
                  },
                })}
              />
              <label>
                Tell us anything you think we should know about your upcoming
                stay in the box to the left.
              </label>
            </FormRow>
            {error ? <span style={{ color: "#b91c1c" }}>{error}</span> : ""}
            <FormRow>
              <Button
                variation="secondary"
                type="reset"
                onClick={() => setResetForm(true)}
              >
                Reset Form
              </Button>
              <Button>Check Availability</Button>
            </FormRow>
          </Form>
          {bookingAvailabilityForm && (
            <BookingAvailabilityForm
              searchCriteria={searchCriteria}
              showNewBookingSummary={showNewBookingSummary}
              showBookingAvailabiltyForm={showBookingAvailabiltyForm}
              selectedCabin={selectedCabin}
              setSelectedCabin={setSelectedCabin}
            />
          )}
        </>
      )}
    </>
  );
}

export default CreateBookingForm;
