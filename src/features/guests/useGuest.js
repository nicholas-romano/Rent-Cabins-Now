import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../../services/apiGuests";

export function useGuest(email) {
  const {
    isLoading,
    data: guest,
    error,
  } = useQuery({
    queryKey: ["guests"],
    queryFn: () => getGuest(email),
  });

  return { isLoading, error, guest };
}
