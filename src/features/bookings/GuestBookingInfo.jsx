import styled from "styled-components";
import Table from "../../ui/Table";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

function GuestBookingInfo({ guestBookingInfo }) {
  const { fullName, email, numGuests } = guestBookingInfo;

  return (
    <Table.Row>
      <Cabin>{fullName}</Cabin>
      <div>{email}</div>
      <div>{numGuests}</div>
    </Table.Row>
  );
}

export default GuestBookingInfo;
