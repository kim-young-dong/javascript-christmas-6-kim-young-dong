import InputView from './view/InputView';
import OutputView from './view/OutputView';
import DateValidator from './validator/DateValidator';
import OrderValidator from './validator/OrderValidator';
import BenefitCalculator from './domain/BenefitCalculator';
import MENU from './constant/Menu';

class App {
  #date;
  #orderMenus;
  #totalOrderPrice;
  #benefits;

  async #inputDate() {
    try {
      const date = await InputView.readDate();
      DateValidator.validate(date);
      return Number(date);
    } catch (error) {
      OutputView.printError(error.message);
      return this.#inputDate();
    }
  }

  async #inputOrder() {
    try {
      let order = await InputView.readOrder();
      order = OrderValidator.validate(order);
      return order;
    } catch (error) {
      OutputView.printError(error.message);
      return this.#inputOrder();
    }
  }

  #calculateTotalOrderPrice() {
    const orderedMenus = this.#orderMenus.map(menu => ({
      ...menu,
      ...MENU.find(({ name }) => name === menu.name),
    }));
    const totalOrderPrice = orderedMenus.reduce((acc, cur) => acc + cur.price * cur.count, 0);
    return totalOrderPrice;
  }

  #calculateBenefits() {
    const calculator = new BenefitCalculator(this.#date, this.#orderMenus, this.#totalOrderPrice);
    this.#benefits = calculator.run();
  }

  #calculateEventBadge() {
    const totalBenefitPrice = this.#benefits.reduce((acc, { price }) => acc + price, 0);
    if (totalBenefitPrice >= 20000) {
      return '산타';
    }
    if (totalBenefitPrice >= 10000) {
      return '트리';
    }
    if (totalBenefitPrice >= 5000) {
      return '별';
    }
    return '없음';
  }

  async #userInput() {
    this.#date = await this.#inputDate();
    const orderedMenus = await this.#inputOrder();
    this.#orderMenus = orderedMenus.map(menu => ({
      ...menu,
      ...MENU.find(({ name }) => name === menu.name),
    }));
    this.#totalOrderPrice = this.#orderMenus.reduce((acc, cur) => acc + cur.price * cur.count, 0);
  }

  #outputMessage() {
    const giftPresented = this.#benefits.find(({ name }) => name === '증정 이벤트')?.present;
    const totalBenefitPrice = this.#benefits.reduce((acc, { price }) => acc + price, 0);
    const orderPriceAfterDiscount = this.#totalOrderPrice - totalBenefitPrice;
    const eventBadge = this.#calculateEventBadge();
    OutputView.printMenu(this.#orderMenus);
    OutputView.printTotalOrderPrice(this.#totalOrderPrice);
    OutputView.printGiftMenu(giftPresented);
    OutputView.printDetailedBenefit(this.#benefits);
    OutputView.printTotalBenefitPrice(totalBenefitPrice);
    OutputView.printOrderPriceAfterDiscount(orderPriceAfterDiscount);
    OutputView.printEventBadge(eventBadge);
  }

  async run() {
    await this.#userInput();
    this.#calculateBenefits();
    this.#outputMessage();
  }
}

export default App;
