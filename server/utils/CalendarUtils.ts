import { CalendarEntry } from "~/types/Calendar";

const testEntries = [
    {
        id: "1",
        title: "Test Event 1",
        description: "This is a test event",
        from: new Date("2025-03-01T00:00:00Z"),
        to: new Date("2025-03-01T23:59:59Z"),
        location: "Test Location",
        organizer: "Test Organizer",
        attendees: ["Test Attendee 1", "Test Attendee 2"],
        isAllDay: true,
    },
    {
        id: "2",
        title: "Test Event 2",
        description: "This is a test event",
        from: new Date("2025-03-02T00:00:00Z"),
        to: new Date("2025-03-02T23:59:59Z"),
        location: "Test Location",
        organizer: "Test Organizer",
        attendees: ["Test Attendee 1", "Test Attendee 2"],
        isAllDay: true,
    },
    {
        id: "3",
        title: "Test Event 3",
        description: "This is a test event",
        from: new Date("2025-03-03T00:00:00Z"),
        to: new Date("2025-03-03T23:59:59Z"),
        location: "Test Location",
        organizer: "Test Organizer",
        attendees: ["Test Attendee 1", "Test Attendee 2"],
        isAllDay: true,
    },
    {
        id: "4",
        title: "Test Event 4",
        description: "This is a test event",
        from: new Date("2025-03-01T00:00:00Z"),
        to: new Date("2025-03-01T23:59:59Z"),
        location: "Test Location",
        organizer: "Test Organizer",
        attendees: ["Test Attendee 1", "Test Attendee 2"],
        isAllDay: true,
    },
] as CalendarEntry[];

export const getTestCalendarEntries = (): CalendarEntry[] => {
    return testEntries;
}