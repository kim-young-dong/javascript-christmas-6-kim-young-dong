import InputView from './view/InputView';
import OutputView from './view/OutputView';
import DateValidator from './validator/DateValidator';
import OrderValidator from './validator/OrderValidator';
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

  
  async run() {
    this.#date = await this.#inputDate();
    this.#menus = await this.#inputOrder();
    OutputView.printMenu(this.#menus);
    this.#totalOrderPrice = this.#calculateOrderPriceBeforeDiscount();
    OutputView.printOrderPriceBeforeDiscount(this.#totalOrderPrice);
  }
}

export default App;
