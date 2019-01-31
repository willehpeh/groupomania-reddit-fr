import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date) {
    const timeElapsed = Date.now() - date.getTime();
    if (timeElapsed > 0 && timeElapsed <= 45000) {
      return 'a few seconds ago';
    } else if (timeElapsed > 45000 && timeElapsed <= 450000) {
      return 'a few minutes ago';
    } else if (timeElapsed > 450000 && timeElapsed <= 3600000) {
      return Math.floor(timeElapsed / 60000) + ' minutes ago';
    } else if (timeElapsed > 36000000 && timeElapsed <= 86400000) {
      return Math.floor(timeElapsed / 3600000) + ' hours ago';
    } else if (timeElapsed > 86400000 && timeElapsed <= 604800000) {
      return Math.floor(timeElapsed / 86400000) + ' days ago';
    } else if (timeElapsed > 604800000  && timeElapsed <= 2628000000) {
      return Math.floor(timeElapsed / 604800000) + ' weeks ago';
    } else {
      return 'more than a month ago';
    }
  }
}
