import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded.");
  }

  return data;
}

export async function getAvailableCabins(numGuests, startDate, endDate) {
  //Find available cabins
  const { data: maxCapacityCabins, error: maxCapacityError } = await supabase
    .from("cabins")
    .select("*")
    .gte("maxCapacity", numGuests);

  let availableCabinsList = [];

  for (let i = 0; i < maxCapacityCabins.length; i++) {
    const cabinId = maxCapacityCabins[i].id;

    let cabinAvailable = true;

    const { data: cabinIdList, error: cabinIdError } = await supabase
      .from("bookings")
      .select("*")
      .eq("cabinId", cabinId);

    for (let k = 0; k < cabinIdList.length; k++) {
      const cabinStartDate = cabinIdList[k].startDate;
      const cabinStartDateTimeStamp = Date.parse(cabinStartDate);
      const cabinEndDate = cabinIdList[k].endDate;
      const cabinEndDateTimeStamp = Date.parse(cabinEndDate);

      if (
        (startDate >= cabinStartDateTimeStamp &&
          startDate <= cabinEndDateTimeStamp) ||
        (endDate >= cabinStartDateTimeStamp && endDate <= cabinEndDateTimeStamp)
      ) {
        cabinAvailable = false;
      }
    }

    if (cabinAvailable === true) {
      availableCabinsList.push(maxCapacityCabins[i]);
    }
  }

  if (maxCapacityError) {
    console.error(maxCapacityError);
    throw new Error("Available cabins could not be loaded.");
  }

  return availableCabinsList;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  //https://ruginlzgppebkuamplch.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // 1. Create Cabin
  let query = supabase.from("cabins");

  // A) CREATE
  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  // B) EDIT
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created.");
  }

  if (hasImagePath) return data;

  //2. Upload Image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created."
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted.");
  }

  return data;
}
