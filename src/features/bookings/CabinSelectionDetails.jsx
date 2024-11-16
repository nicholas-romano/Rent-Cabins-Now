import styled from "styled-components";
import Table from "../../ui/Table";

const Img = styled.img`
  display: block;
  width: 200px;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
  margin: 20px;
`;

function CabinSelectionDetails({ cabinSelectionDetails }) {
  const { cabinName, image, description, maxCapacity } = cabinSelectionDetails;

  return (
    <Table.Row>
      <Img src={image} />

      <div></div>
      <div>{description}</div>
    </Table.Row>
  );
}

export default CabinSelectionDetails;
