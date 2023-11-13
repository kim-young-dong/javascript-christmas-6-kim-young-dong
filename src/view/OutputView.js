import { Console } from '@woowacourse/mission-utils';

const OutputView = {
  printWellcome() {
    Console.print('안녕하세요! 우테코 식당 12월 이벤트 플래너입니다.');
  },
  printPreview(date) {
    Console.print(`12월 ${date}일에 우테코 식당에서 받을 이벤트 혜택 미리 보기!`);
  },
  printMenu(menus) {
    Console.print('\n<주문 메뉴>');
    menus.forEach(menu => {
      Console.print(`${menu.name} - ${menu.count}개`);
    });
  },
  printOrderPriceBeforeDiscount(price) {
    Console.print('\n<할인 전 총주문 금액>');
    Console.print(`${price}원`);
  },
  printGiftMenu(giftPresented) {
    Console.print('\n<증정 메뉴>');
    Console.print(`${giftPresented ? '샴페인 1개' : '없음'}`);
  },
  printDetailedBenefit(benefits) {
    Console.print('\n<혜택 내역>');
    if (benefits.length === 0) {
      Console.print('없음');
    } else {
      benefits.forEach(benefit => {
        Console.print(`${benefit.name}: -${benefit.price.toLocaleString()}원`);
      });
    }
  },
  printTotalBenefitPrice(price) {
    Console.print('\n<총혜택 금액>');
    Console.print(`-${price.toLocaleString()}원`);
  },
  printOrderPriceAfterDiscount(price) {
    Console.print('\n<할인 후 예상 결제 금액>');
    Console.print(`${price.toLocaleString()}원`);
  },
  printEventBadge(badge) {
    Console.print('\n<12월 이벤트 배지>');
    Console.print(`${badge}`);
  },
  printError(error) {
    Console.print(error.message);
  },
};

export default OutputView;
