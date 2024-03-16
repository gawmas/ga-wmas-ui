export class AppConfig {

  public static getSuccessRateColor(value: number): string {
    if (value === 0 || value < 5) {
      return '#FAFAF9';   // stone-50
    } else if (value >= 5 && value < 10) {
      return '#A8A29E';  // stone-400
    } else if (value >= 10 && value < 20) {
      return '#FDE68A';  // amber-200
    } else if (value >= 20 && value < 30) {
      return '#FCD34D';  // amber-300
    } else if (value >= 30 && value < 40) {
      return '#FACC15';  // yellow-400
    } else if (value >= 40 && value < 50) {
      return '#CA8A04';  // yellow-600
    } else if (value >= 50 && value < 60) {
      return '#BEF264';  // lime-300
    } else if (value >= 60 && value < 70) {
      return '#65A30D';  // lime-600
    } else if (value >= 70 && value < 80) {
      return '#A3E635';  // lime-400
    } else if (value >= 80 && value < 90) {
      return '#FCA5A5';  // red-300
    } else if (value >= 90 && value <= 100) {
      return '#EF4444';  // red-500
    } else if (value > 100) {
      return '#B91C1C' // red-700
    }
    return '';
}


}
