export const fetchParticipantByEmail = async (email) => {
  const response = await fetch(`http://192.168.0.67:8080/participants/fetch/email/${email}`);
  
  if (!response.ok) {
    throw new Error("Participant not found.");
  }
  return await response.json();
};