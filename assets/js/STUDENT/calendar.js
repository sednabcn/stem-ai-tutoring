// calendar.js
export const updateCalendar = (availabilityMap, slots) => {
    // Convert slots NodeList to an array
    const slotsArray = Array.from(slots);

    // Log the slots to check their values
    console.log("Slots:", slotsArray);

    slotsArray.forEach(slot => {
        const day = slot.dataset.day;
        const time = slot.dataset.time;

        // Log day and time to verify
        console.log(`Slot Day: ${day}, Time: ${time}`);

        const availability = availabilityMap[time] ? availabilityMap[time][day] : "not-available";

        // Update the class based on availability
        if (availability === "available") {
            slot.classList.add("available");
            slot.classList.remove("booked", "no-available");
        } else if (availability === "booked") {
            slot.classList.add("booked");
            slot.classList.remove("available", "no-available");
        } else {
            slot.classList.add("no-available");
            slot.classList.remove("available", "booked");
        }
    });
};

// Example of handleSlotSelection function
export const handleSlotSelection = (slot, availabilityMap, slots) => {
    // Example logic for handling slot selection
    console.log("Slot selected:", slot);
    // Add more functionality as required
};
