export default async function fetchCalendar() {
    const url = `http://localhost:3000/calendar`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };
    let response = await fetch(url, options);
    const json = await response.json();
    const calendar = json.calendar;
    calendar.firstDay = new Date(calendar.firstDay);
    calendar.lastDay = new Date(calendar.lastDay);
    calendar.holidays.forEach(holiday => {
        holiday.start = new Date(holiday.start);
        if (holiday.end !== null)
            holiday.end = new Date(holiday.end);
    });
    return calendar;
}