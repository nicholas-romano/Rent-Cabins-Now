import { Controller } from "react-hook-form";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export const DatePickerField = ({
  control,
  name,
  placeholder,
  resetDates,
  setResetDates,
}) => {
  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: "This field is required",
      }}
      render={({ field, fieldState }) => {
        return (
          <>
            <DatePicker
              placeholder={placeholder}
              ref={field.ref}
              name={field.name}
              onBlur={field.onBlur}
              value={field.value && !resetDates ? dayjs(field.value) : ""}
              disabledDate={disabledDate}
              onChange={(date) => {
                setResetDates(false);
                field.onChange(date ? date.valueOf() : null);
              }}
              format={"MM/DD/YYYY"}
            />
            {fieldState.error ? (
              <span style={{ color: "#b91c1c" }}>
                {fieldState.error?.message}
              </span>
            ) : null}
          </>
        );
      }}
    />
  );
};
