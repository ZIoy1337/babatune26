// Сервер отдаёт UTC; если суффикса Z нет, браузер прочитает время как местное
export function parseUtc(s) {
    return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(s) ? s : s + "Z").getTime();
}