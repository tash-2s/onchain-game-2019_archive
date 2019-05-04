const dateStringOption = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  timeZoneName: "short"
}

export class Time {
  static now = () => Math.floor(Date.now() / 1000)
  static nowFromDiff = (timeDiff: number) => Time.now() + timeDiff
  static unixtimeToDate = (unixtime: number) => new Date(unixtime * 1000)
  static unixtimeToDateString = (unixtime: number) =>
    new Intl.DateTimeFormat(undefined, dateStringOption).format(Time.unixtimeToDate(unixtime))
}
