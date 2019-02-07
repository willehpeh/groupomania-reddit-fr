import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date) {
    const timeElapsed = Date.now() - date.getTime();
    if (timeElapsed > 0 && timeElapsed <= 45000) {
      return 'il y a quelques secondes';
    } else if (timeElapsed > 45000 && timeElapsed <= 450000) {
      return 'il y a quelques minutes';
    } else if (timeElapsed > 450000 && timeElapsed <= 3600000) {
      return 'il y a ' + Math.floor(timeElapsed / 60000) + ' minutes';
    } else if (timeElapsed > 36000000 && timeElapsed <= 86400000) {
      return 'il y a ' + Math.floor(timeElapsed / 3600000) + ' heures';
    } else if (timeElapsed > 86400000 && timeElapsed <= 604800000) {
      return 'il y a ' + Math.floor(timeElapsed / 86400000) + ' jours';
    } else if (timeElapsed > 604800000  && timeElapsed <= 2628000000) {
      return 'il y a ' + Math.floor(timeElapsed / 604800000) + ' semaines';
    } else {
      return 'il y a plus d\'un mois';
    }
  }
}
