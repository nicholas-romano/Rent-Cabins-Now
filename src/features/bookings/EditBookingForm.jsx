import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";

import { useForm } from "react-hook-form";
import { useSettings } from "../settings/useSettings";
import { DatePickerField } from "../../ui/DatePickerField";
import { useState } from "react";
import Checkbox from "../../ui/Checkbox";
import Textarea from "../../ui/Textarea";
import { useEditBooking } from "./useEditBooking";

function EditBookingForm({ bookingToEdit = {}, onCloseModal }) {
  const { isEditing, editBooking } = useEditBooking();
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();
  const [error, setError] = useState("");
  const [resetDates, setResetDates] = useState(false);

  const { id: editId, ...editValues } = bookingToEdit;

  const { register, handleSubmit, control, reset, formState } = useForm({
    defaultValues: editValues,
  });

  const { errors } = formState;

  const [addBreakfast, setAddBreakfast] = useState(editValues.hasBreakfast);
  const [observations, setObservations] = useState(editValues.observations);

  //console.log("bookingToEdit ", bookingToEdit);

  function onSubmit(data) {
    if (data.startDate > data.endDate) {
      setError("Start date must be earlier than end date.");
    } else {
      setError("");
      console.log("data: ", data);

      // editBooking(
      //   { editBookingData: data, id: editId },
      //   {
      //     onSuccess: (data) => {
      //       reset();
      //       onCloseModal?.();
      //     },
      //   }
      // );
    }
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          name="fullName"
          defaultValue={editValues.guests.fullName}
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
          defaultValue={editValues.guests.email}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address.",
            },
          })}
        />
      </FormRow>
      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          name="numGuests"
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
      <FormRow>
        <Checkbox
          onChange={() => setAddBreakfast(!addBreakfast)}
          checked={addBreakfast}
          id="hasBreakfast"
          name="hasBreakfast"
          defaultChecked={addBreakfast}
        >
          Add Breakfast for an additional ${breakfastPrice} more per guest per
          day.
        </Checkbox>
        <Textarea
          type="text"
          id="observations"
          name="observations"
          onChange={(e) => setObservations(e.target.value)}
          defaultValue={observations}
          {...register("observations", {
            pattern: {
              value: /[\w\d\s]+/,
              message: "Can only have alphanumeric characters.",
            },
          })}
        />
        <label>
          Tell us anything you think we should know about your upcoming stay in
          the box to the left.
        </label>
      </FormRow>
      {error ? <span style={{ color: "#b91c1c" }}>{error}</span> : ""}
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>Save</Button>
      </FormRow>
    </Form>
  );
}

export default EditBookingForm;
