import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import { useForm } from "react-hook-form";
import { DatePickerField } from "../../ui/DatePickerField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingAvailabilityForm from "./BookingAvailabilityForm";
import NewBookingSummary from "./NewBookingSummary";

function CreateBookingForm() {
  const [searchCriteria, setSearchCriteria] = useState({});
  const [selectedCabin, setSelectedCabin] = useState();
  const [bookingAvailabilityForm, showBookingAvailabiltyForm] = useState(false);
  const [newBookingSummary, showNewBookingSummary] = useState(false);
  const { register, handleSubmit, control, formState } = useForm();
  const [error, setError] = useState("");
  const [resetDates, setResetDates] = useState(false);
  const navigate = useNavigate();

  const { errors } = formState;

  function onError(errors) {
    console.log("errors: ", errors);
  }

  function onSubmit(data) {
    if (data.startDate > data.endDate) {
      setError("Start date must be earlier than end date.");
    } else {
      setError("");

      setSearchCriteria(data);
      showBookingAvailabiltyForm(true);
    }
  }

  return (
    <>
      {newBookingSummary ? (
        <NewBookingSummary
          searchCriteria={searchCriteria}
          selectedCabin={selectedCabin}
        />
      ) : (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow label="Name" error={errors?.name?.message}>
              <Input
                type="text"
                id="fullName"
                {...register("fullName", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow label="Email address" error={errors?.email?.message}>
              <Input
                type="email"
                id="email"
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please provide a valid email address.",
                  },
                })}
              />
            </FormRow>
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
                resetDates={resetDates}
                setResetDates={setResetDates}
              />
            </FormRow>
            <FormRow label="End Date">
              <DatePickerField
                control={control}
                name="endDate"
                placeholder="End Date"
                resetDates={resetDates}
                setResetDates={setResetDates}
              />
            </FormRow>
            {error ? <span style={{ color: "#b91c1c" }}>{error}</span> : ""}
            <FormRow>
              <Button
                variation="secondary"
                type="reset"
                onClick={() => setResetDates(true)}
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
