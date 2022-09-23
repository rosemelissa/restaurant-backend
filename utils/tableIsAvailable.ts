export default function tableIsAvailable(bookingsForThatTable: {time: string}[], newBookingTime: string) {
    let availableTimes = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];
    const index = availableTimes.indexOf(newBookingTime)
    const badTimes = [availableTimes[index - 2], availableTimes[index -1], availableTimes[index], availableTimes[index + 1], availableTimes[index + 2]];
    for (const booking of bookingsForThatTable) {
        if (badTimes.includes(booking.time)) {
            return false;
        }
    };
    return true;
}