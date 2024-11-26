import supabase, { supabaseUrl } from "./supabase";

export async function getGuests() {
  const { data, error } = await supabase.from("guests").select("*");

  if (error) {
    console.error(error);
    throw new Error("Guests list could not be loaded.");
  }

  return data;
}

export async function getGuest(email) {
  const { data, error } = await supabase
    .from("guests")
    .select()
    .eq("email", email)
    .single();

  if (error) {
    return error;
  }

  return data;
}

export async function createNewGuest(guest) {
  // 1. Create Guest
  let query = supabase.from("guests");

  // 2. INSERT
  query = query.insert(guest);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function updateNewFullName(fullName, id) {
  const { data, error } = await supabase
    .from("guests")
    .update({ fullName: fullName })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest full name could not be updated");
  }
  return data;
}

export async function updateNewEmail(email, id) {
  const { data, error } = await supabase
    .from("guests")
    .update({ email: email })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest email could not be updated");
  }
  return data;
}
