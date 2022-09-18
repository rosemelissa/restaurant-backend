export default function timeIsAvailable(time: string, unavailableTimes: {table_id: number, time: string}[], possibleTables: {table_id: number}[]) {
    const allTimes = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
    const index = allTimes.indexOf(time)
    const badTimes: string[] = [allTimes[index-2], allTimes[index-1], allTimes[index], allTimes[index+1], allTimes[index+2]];
    for (const table of possibleTables) {
        let tableAvailable = true;
        for (const unavailableTime of unavailableTimes) {
            if ((unavailableTime.table_id === table.table_id) && (badTimes.includes(unavailableTime.time))) {
                tableAvailable = false;
            }
        }
        if (tableAvailable) {
            return true;
        }
    }
    return false;
}