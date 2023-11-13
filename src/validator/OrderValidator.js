import MENU from '../constant/Menu';

const OrderValidator = {
  ERROR_MESSAGE: {
    invalidOrder: '[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.',
    exceedOrderCount: '[ERROR] 메뉴는 한 번에 최대 20개까지만 주문 가능합니다.',
  },
  MINIMUM_ORDER_COUNT: 1,
  MAX_ORDER_COUNT: 20,
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
    if (totalOrderCount > this.MAX_ORDER_COUNT) {
      throw new Error(this.ERROR_MESSAGE.exceedOrderCount);
    }
  },
  validateMenu(menus) {
    menus.forEach(menu => {
      const { name, count } = menu;
      const isInvalid = this.validateMenuName(name) || this.validateMinimumOrderCount(count);
      if (isInvalid) {
        throw new Error(this.ERROR_MESSAGE.invalidOrder);
      }
    });
  },
  validateMenuName(menuName) {
    const menuTypes = Object.keys(MENU);
    const isInvalidMenu = menuTypes.every(type =>
      MENU[type].every(({ name }) => name !== menuName)
    );
    if (isInvalidMenu) {
      return false;
    }
    return true;
  },
  validateMinimumOrderCount(count) {
    if (count < this.MINIMUM_ORDER_COUNT) {
      return false;
    }
    return true;
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
    this.validateMenu(menus);
    return menus;
  },
};

export default OrderValidator;
