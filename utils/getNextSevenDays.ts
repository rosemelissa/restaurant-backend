export default function getNextSevenDays(startDate: string): string[] {
    const sevenDays: string[] = [startDate];
    for (let i = 1; i < 7; i++) {
        const dayToAdd: string = (new Date(Date.parse(startDate) + (1000*60*60*24*i))).toISOString().substring(0, 10);
        sevenDays.push(dayToAdd);
    }
    return sevenDays;
}