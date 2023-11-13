const DateValidator = {
  ERROR_MESSAGE: '[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.',
  MAX_DATE: 31,
  MIN_DATE: 1,
  validate(date) {
    if (date < this.MIN_DATE || date > this.MAX_DATE) {
      throw new Error(this.ERROR_MESSAGE);
    }
  },
};

export default DateValidator;
