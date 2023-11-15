const EVENT_PERIOD = {
  eventStart: 1,
  DdayEventEnd: 25,
  otherEventEnd: 31,
  DdayDiscount() {
    const period = [];
    for (let date = this.eventStart; date <= this.DdayEventEnd; date += 1) {
      period.push(date);
    }
    return period;
  },
  weekdayDiscount() {
    const weekdays = [];
    for (let day = this.eventStart; day <= this.otherEventEnd; day += 1) {
      const date = new Date(2023, 11, day);
      const dayOfWeek = date.getDay();

      if (dayOfWeek !== 5 && dayOfWeek !== 6) {
        weekdays.push(new Date(date).getDate());
      }
    }
    return weekdays;
  },
  weekendDiscount() {
    const weekends = [];
    for (let day = this.eventStart; day <= this.otherEventEnd; day += 1) {
      const date = new Date(2023, 11, day);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 5 || dayOfWeek === 6) {
        weekends.push(new Date(date).getDate());
      }
    }
    return weekends;
  },
  specialDidcount() {
    const weekends = [];
    for (let day = this.eventStart; day <= this.otherEventEnd; day += 1) {
      const date = new Date(2023, 11, day);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 25) {
        weekends.push(new Date(date).getDate());
      }
    }
    return weekends;
  },
};

export default EVENT_PERIOD;
