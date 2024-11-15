import { useQuery } from "@tanstack/react-query";
import { getAvailableCabins } from "../../services/apiCabins";

export function useAvailableCabins(searchCriteria) {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: () =>
      getAvailableCabins(
        searchCriteria.numGuests,
        searchCriteria.startDate,
        searchCriteria.endDate
      ),
  });

  return { isLoading, error, cabins };
}
