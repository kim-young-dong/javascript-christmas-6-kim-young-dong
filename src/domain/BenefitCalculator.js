import EVENT_PERIOD from '../constant/EventPeriod';
import MENU from '../constant/Menu';

const GIFT_EVENT_PRICE = 120000;
const GIFT_EVENT_BENEFIT = {
  ...MENU.find(({ name }) => name === '샴페인'),
  count: 1,
};
const SPECIAL_DISCOUNT_PRICE = 1000;
const IS_CANDIDATES = {
  giftEvent: orderPrice => orderPrice >= GIFT_EVENT_PRICE,
  DdayDiscount: reservationDate => EVENT_PERIOD.DdayDiscount().includes(reservationDate),
  weekdayDiscount: (reservationDate, menus) => {
    const dessertMenus = MENU.filter(({ type }) => type === 'dessert').map(({ name }) => name);
    const includesDessert = menus.some(({ name }) => dessertMenus.includes(name));
    const indlucdeDate = EVENT_PERIOD.weekdayDiscount().includes(reservationDate);
    return indlucdeDate && includesDessert;
  },
  weekendDiscount: (reservationDate, menus) => {
    const mainMenus = MENU.filter(({ type }) => type === 'main').map(({ name }) => name);
    const includesMain = menus.some(({ name }) => mainMenus.includes(name));
    const indlucdeDate = EVENT_PERIOD.weekendDiscount().includes(reservationDate);
    return indlucdeDate && includesMain;
  },
  specialDidcount: reservationDate => EVENT_PERIOD.specialDidcount().includes(reservationDate),
};

class BenefitCalculator {
  #reservationDate;
  #menus;
  #totalOrderPrice;
  #benefits;

  constructor(reservationDate, menus, totalOrderPrice) {
    this.#reservationDate = reservationDate;
    this.#menus = menus;
    this.#totalOrderPrice = totalOrderPrice;
    this.#benefits = [];
  }

  #calculateGiftEventBenefit() {
    if (this.#totalOrderPrice >= GIFT_EVENT_PRICE) {
      this.#benefits.push({
        name: '증정 이벤트',
        price: GIFT_EVENT_BENEFIT.price,
        present: `${GIFT_EVENT_BENEFIT.name} ${GIFT_EVENT_BENEFIT.count}개`,
      });
    }
  }

  #calculateDdayEventBenefit() {
    if (IS_CANDIDATES.DdayDiscount(this.#reservationDate)) {
      const DdayBenefit = {
        name: '크리스마스 디데이 할인',
        price: 1000,
      };
      for (let day = EVENT_PERIOD.eventStart; day < this.#reservationDate; day += 1) {
        DdayBenefit.price += 100;
      }
      this.#benefits.push(DdayBenefit);
    }
  }

  #calculateWeekdayEventBenefit() {
    if (IS_CANDIDATES.weekdayDiscount(this.#reservationDate, this.#menus)) {
      const dessertsMenus = MENU.filter(({ type }) => type === 'dessert').map(({ name }) => name);
      const weekdayEventDiscount = this.#menus
        .filter(({ name }) => dessertsMenus.includes(name))
        .reduce((acc, cur) => acc + cur.count * 2023, 0);
      const weekdayBenefit = {
        name: '평일 할인',
        price: weekdayEventDiscount,
      };
      this.#benefits.push(weekdayBenefit);
    }
  }

  #calculateWeekendDiscount() {
    if (IS_CANDIDATES.weekendDiscount(this.#reservationDate, this.#menus)) {
      const mainMenus = MENU.filter(({ type }) => type === 'main').map(({ name }) => name);
      const weekendDiscount = this.#menus
        .filter(({ name }) => mainMenus.includes(name))
        .reduce((acc, cur) => acc + cur.count * 2023, 0);
      const weekendBenefit = {
        name: '주말 할인',
        price: weekendDiscount,
      };
      this.#benefits.push(weekendBenefit);
    }
  }

  #calculateSpecialDiscount() {
    if (IS_CANDIDATES.specialDidcount(this.#reservationDate)) {
      this.#benefits.push({
        name: '특별 할인',
        price: SPECIAL_DISCOUNT_PRICE,
      });
    }
  }

  run() {
    this.#calculateGiftEventBenefit();
    this.#calculateDdayEventBenefit();
    this.#calculateWeekdayEventBenefit();
    this.#calculateWeekendDiscount();
    this.#calculateSpecialDiscount();
    return this.#benefits;
  }
}

export default BenefitCalculator;
