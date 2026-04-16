/**
 * Dynamic Slot Generation Logic
 * @param {string} startTime - Format "HH:MM AM/PM" or "HH:MM"
 * @param {number} operatingHours - Total hours clinic stays open
 * @param {number} slotDurationMinutes - Minutes per slot
 * @returns {Array} Array of time slot strings
 */
export const generateSlots = (startTime, operatingHours, slotDurationMinutes) => {
  const slots = [];
  
  // Basic parsing for HH:MM format
  let [hours, minutes] = startTime.split(':').map(Number);
  
  // Handle AM/PM if present
  if (startTime.toLowerCase().includes('pm') && hours < 12) hours += 12;
  if (startTime.toLowerCase().includes('am') && hours === 12) hours = 0;

  let currentTotalMins = hours * 60 + minutes;
  const endTotalMins = currentTotalMins + (operatingHours * 60);

  while (currentTotalMins + slotDurationMinutes <= endTotalMins) {
    const h = Math.floor(currentTotalMins / 60);
    const m = currentTotalMins % 60;
    
    // Format to 12-hour clock for UI
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    const displayM = m.toString().padStart(2, '0');
    
    slots.push(`${displayH}:${displayM} ${ampm}`);
    
    currentTotalMins += slotDurationMinutes;
  }

  return slots;
};

/**
 * Calculates Estimated Wait Time dynamically
 * @param {number} currentlyServingToken - Token number currently in progress
 * @param {number} patientToken - The logged-in patient's token
 * @param {number} slotDuration - Base minutes per slot
 * @returns {number} Wait time in minutes
 */
export const calculateWaitTime = (currentlyServingToken, patientToken, slotDuration = 30) => {
  if (!patientToken || !currentlyServingToken) return 0;
  const gap = patientToken - currentlyServingToken;
  return gap > 0 ? gap * slotDuration : 0;
};
