import MENU from '../constant/Menu';

const OrderValidator = {
  ERROR_MESSAGE: {
    invalidOrder: '[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.',
    exceedOrderCount: '[ERROR] 메뉴는 한 번에 최대 20개까지만 주문 가능합니다.',
  },
  MINIMUM_ORDER_COUNT: 1,
  MAXIMUM_TOTAL_ORDER_COUNT: 20,
  validatePattern(order) {
    const menus = order.split(',');
    const pattern = /^[가-힣]+-[0-9]+$/;
    const isInvalidPattern = menus.some(menu => !pattern.test(menu));
    if (isInvalidPattern) {
      throw new Error(this.ERROR_MESSAGE.invalidOrder);
    }
  },
  validateDuplicate(menus) {
    const names = menus.map(({ name }) => name);
    const isDuplicate = names.some((name, index) => names.indexOf(name) !== index);
    if (isDuplicate) {
      throw new Error(this.ERROR_MESSAGE.invalidOrder);
    }
  },
  validateTotalOrderCount(menus) {
    const totalOrderCount = menus
      .map(({ count }) => count)
      .reduce((acc, cur) => acc + Number(cur), 0);
    if (totalOrderCount > this.MAXIMUM_TOTAL_ORDER_COUNT) {
      throw new Error(this.ERROR_MESSAGE.exceedOrderCount);
    }
  },
  validateMenuName(menus) {
    const isInvalid = menus.every(orderMenu => MENU.every(menu => menu.name !== orderMenu.name));
    if (isInvalid) {
      throw new Error(this.ERROR_MESSAGE.invalidOrder);
    }
  },
  validateMinimumOrderCount(menus) {
    const isInvalid = menus.every(menu => menu.count < this.MINIMUM_ORDER_COUNT);
    if (isInvalid) {
      throw new Error(this.ERROR_MESSAGE.invalidOrder);
    }
  },
  getMenus(order) {
    return order.split(',').map(menu => {
      const [name, count] = menu.split('-');
      return {
        name,
        count,
      };
    });
  },
  validate(order) {
    const menus = this.getMenus(order);
    this.validatePattern(order);
    this.validateTotalOrderCount(menus);
    this.validateDuplicate(menus);
    this.validateMenuName(menus);
    this.validateMinimumOrderCount(menus);
    return menus;
  },
};

export default OrderValidator;
