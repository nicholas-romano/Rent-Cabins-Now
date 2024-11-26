import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNewFullName } from "../../services/apiGuests";
import toast from "react-hot-toast";

export function useUpdateFullName() {
  const queryClient = useQueryClient();

  const { mutate: updateFullName, isLoading: isEditingFullName } = useMutation({
    mutationFn: ({ newFullNameData, id }) =>
      updateNewFullName(newFullNameData, id),
    onSuccess: () => {
      toast.success("Guest Full Name successfully edited");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditingFullName, updateFullName };
}
