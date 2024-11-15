import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewGuest } from "../../services/apiGuests";
import toast from "react-hot-toast";

export function useCreateGuest() {
  const queryClient = useQueryClient();

  const { mutate: createGuest, isLoading: isCreating } = useMutation({
    mutationFn: createNewGuest,
    onSuccess: () => {
      toast.success("New guest successfully created");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createGuest };
}
