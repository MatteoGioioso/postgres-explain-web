import {HASH, HASH_CONDITION, HASH_JOIN, PlanRow, RELATION_NAME, SEQUENTIAL_SCAN} from './types'
import {useTheme} from "@mui/material/styles";

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

export function getCellWarningColor(reference: number, total: number, theme?: any): string {
    if (total === 0 || total === undefined) return '#fff'

    const percentage = (reference / total) * 100
    if (percentage <= 10) {
        return theme.palette.success.lighter
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

export function truncateText(text: string, chars: number): string {
    return text.slice(0, chars) + '...'
}