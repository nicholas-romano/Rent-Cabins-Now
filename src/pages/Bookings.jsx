import BookingTable from "../features/bookings/BookingTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import { useState } from "react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const navigate = useNavigate();
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Row>

      <BookingTable />
      <Button onClick={() => navigate(`/bookings/create-new-booking`)}>
        Add new Booking
      </Button>
    </>
  );
}

export default Bookings;
