import styled from "styled-components";
import Table from "../../ui/Table";
import { formatCurrency } from "../../utils/helpers";

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

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function CabinBookingSummaryRow({ cabinBookingSummary }) {
  const { cabinPrice, numNights, extrasPrice, totalPrice } =
    cabinBookingSummary;

  return (
    <Table.Row>
      <Price>{formatCurrency(cabinPrice)}</Price>
      <div>{numNights}</div>
      <Price>{formatCurrency(extrasPrice)}</Price>
      <Price>{formatCurrency(totalPrice)}</Price>
    </Table.Row>
  );
}

export default CabinBookingSummaryRow;
