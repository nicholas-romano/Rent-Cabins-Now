import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNewEmail } from "../../services/apiGuests";
import toast from "react-hot-toast";

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  const { mutate: updateEmail, isLoading: isEditingEmail } = useMutation({
    mutationFn: ({ newEmailData, id }) => updateNewEmail(newEmailData, id),
    onSuccess: () => {
      toast.success("Guest Email successfully updated");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditingEmail, updateEmail };
}
