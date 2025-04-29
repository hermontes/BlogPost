export function formatDateAndTime(givenDateAndTime) {
  const dateCreated = new Date(givenDateAndTime).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const timeCreated = new Date(givenDateAndTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  return { dateCreated, timeCreated };
};