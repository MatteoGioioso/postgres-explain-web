export const betterNumbers = (num: number): string => {
    const ONE_MILLION = 1000000
    const THOUSAND = 1000
    const HUNDRED = 100
    const TEN = 10
    const ONE = 1

    if (num >= ONE_MILLION) {
        return `${Math.floor(num / ONE_MILLION)} Mil`
    }

    if (num >= THOUSAND) {
        return `${Math.floor(num / THOUSAND)} K`
    }

    if (num < THOUSAND && num >= HUNDRED) {
        return `${Math.floor(num)}`
    }

    if (num <= HUNDRED && num >= TEN) {
        return `${Math.floor(num * 100) / 100}`
    }

    if (num <= TEN && num >= ONE) {
        return `${Math.floor(num * 100) / 100}`
    }

    if (num <= ONE) {
        return `${Math.floor(num * 1000) / 1000}`
    }

    return num.toString()
}

export function betterTiming(milliseconds: number): string {
    const seconds = Math.round(milliseconds / 1000);

    if (seconds < 1) {
        return Math.floor(milliseconds * 1000) / 1000 + ' ms';
    } else if (seconds < 60) {
        const secs = milliseconds / 1000
        return Math.round(secs * 100) / 100 + ' s';
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return minutes + ' min';
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return hours + ' h';
    } else {
        const days = Math.floor(seconds / 86400);
        return days + ' d';
    }
}

export function betterDiskSize(blocks: number): string {
    const units = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let size = blocks*8192;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function getPercentageColor(reference: number, total: number, theme?: any): string {
    if (total === 0 || total === undefined) return '#fff'

    const percentage = getPercentage(reference, total)
    if (percentage <= 10) {
        return theme.palette.secondary.A100
    }

    if (percentage > 10 && percentage < 50) {
        return theme.palette.warning.light
    }

    if (percentage > 50 && percentage < 90) {
        return theme.palette.warning.main
    }

    if (percentage > 90) {
        return theme.palette.error.main
    }

    return '#fff'
}

export function getEstimationColor(estimationFactor: number, theme?: any): string {
    if (estimationFactor >= 10 && estimationFactor < 100) {
        return theme.palette.warning.light
    }

    if (estimationFactor >= 100 && estimationFactor < 1000) {
        return theme.palette.warning.main
    }

    if (estimationFactor >= 1000) {
        return theme.palette.error.main
    }

    return '#fff'
}

export function getPercentage(reference: number, total: number): number {
    return (reference / total) * 100
}

export function truncateText(text: string, chars: number): string {
    if (text.length <= chars) return text;
    return text.slice(0, chars) + '...'
}

export const areRowsOverEstimated = (direction: string): boolean => {
    switch (direction) {
        case 'over':
            return true
        case 'under':
            return false
        default:
            return true
    }
}