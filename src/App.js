import InputView from './view/InputView';
import OutputView from './view/OutputView';
import DateValidator from './validator/DateValidator';
import OrderValidator from './validator/OrderValidator';
import BenefitCalculator from './domain/BenefitCalculator';
import MENU from './constant/Menu';

class App {
  #date;
  #menus;
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

  #calculateOrderPriceBeforeDiscount() {
    const orderedMenus = MENU.filter(menu => this.#menus.find(({ name }) => name === menu.name));
    const totalOrderPrice = orderedMenus.reduce(
      (acc, cur) => acc + cur.price * this.#menus.find(({ name }) => name === cur.name).count,
      0
    );
    return totalOrderPrice;
  }

  #calculateBenefits() {
    const calculator = new BenefitCalculator(this.#date, this.#menus, this.#totalOrderPrice);
    this.#benefits = calculator.run();
  }

  #outPutBenefits() {
    const hasGiftEvent = this.#benefits.find(({ name }) => name === '증정 이벤트');
    OutputView.printGiftMenu(!!hasGiftEvent);
    OutputView.printDetailedBenefit(this.#benefits);
  }

  #calculteTotalBenefitPrice() {
    return this.#benefits.reduce((acc, { price }) => acc + price, 0);
  }

  #calculateOrderPriceAfterDiscount() {
    return this.#calculateOrderPriceBeforeDiscount() - this.#calculteTotalBenefitPrice();
  }

  #calculateEventBadge() {
    const totalBenefitPrice = this.#calculteTotalBenefitPrice();
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

  async run() {
    this.#date = await this.#inputDate();
    this.#menus = await this.#inputOrder();
    OutputView.printMenu(this.#menus);
    this.#totalOrderPrice = this.#calculateOrderPriceBeforeDiscount();
    OutputView.printOrderPriceBeforeDiscount(this.#totalOrderPrice);
    this.#calculateBenefits();
    this.#outPutBenefits();
    OutputView.printTotalBenefitPrice(this.#calculteTotalBenefitPrice());
    OutputView.printOrderPriceAfterDiscount(this.#calculateOrderPriceAfterDiscount());
    OutputView.printEventBadge(this.#calculateEventBadge());
  }
}

export default App;
