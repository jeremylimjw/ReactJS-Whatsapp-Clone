import moment from 'moment';

export function parseDate(date) {
    const today = new Date();
    const d = moment(date);
    if (d.toDate().toDateString() === today.toDateString()) {
        return "Today";
    }
    return d.format('dddd, D MMM YYYY');
}

export function parseShortDate(date) {
    const today = new Date();
    const d = moment(date);
    if (d.toDateString() === today.toDateString()) {
        return "Today";
    }
    return moment(date).format('D/M/YY');
}

export function parseTime(date) {
    return moment(date).format('LT');
}

export function parseMediumDateTime(date) {
    return moment(date).format('D MMM, YYYY h:mm A');
}