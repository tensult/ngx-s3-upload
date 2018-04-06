
export class MonthUtil {

  private static monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  static getName(index: number) {
    return MonthUtil.monthList[index];
  }

}