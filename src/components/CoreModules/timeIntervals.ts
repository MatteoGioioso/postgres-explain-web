import moment from "moment";
import {useState} from "react";

const getMomentNow = () => () => moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ssZ')
const getMomentAgo = (hours: number) => () => moment(new Date()).subtract(hours, 'hour').utc().format('YYYY-MM-DDTHH:mm:ssZ')

export interface Interval {
    from: () => string
    to: () => string
    name: string
    id: string
}

export const INTERVALS: Interval[] = [
    {
        name: "Last 5 minutes",
        from: getMomentAgo(0.08),
        to: getMomentNow(),
        id: "Last 5_minutes"
    },
    {
        name: "Last 15 minutes",
        from: getMomentAgo(1 / 4),
        to: getMomentNow(),
        id: "Last 15_minutes"
    },
    {
        name: "Last 1 hour",
        from: getMomentAgo(1),
        to: getMomentNow(),
        id: "Last_1_hour"
    },
    {
        name: "Last 3 hours",
        from: getMomentAgo(3),
        to: getMomentNow(),
        id: "last_3_hours"
    },
    {
        name: "Last 6 hours",
        from: getMomentAgo(6),
        to: getMomentNow(),
        id: "last_6_hours"
    },
    {
        name: "Last 12 hours",
        from: getMomentAgo(12),
        to: getMomentNow(),
        id: "last_2_hours"
    },
    {
        name: "Last 24 hours",
        from: getMomentAgo(24),
        to: getMomentNow(),
        id: "last_4_hours"
    },
    {
        name: "Last 2 days",
        from: getMomentAgo(24 * 2),
        to: getMomentNow(),
        id: "last_2_days"
    },
    {
        name: "Last 7 days",
        from: getMomentAgo(24 * 7),
        to: getMomentNow(),
        id: "last_7_days"
    }
]

export const useTimeIntervals = () => {
    const [timeInterval, setTimeInterval] = useState<Interval>({
        name: "Last 1 hour",
        from: getMomentAgo(1),
        to: getMomentNow(),
        id: "last_1_hour"
    })

    return {
        timeInterval, setTimeInterval
    }
}