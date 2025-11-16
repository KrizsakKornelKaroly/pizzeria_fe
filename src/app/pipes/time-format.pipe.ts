import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {

  transform(value:  string | null | undefined, locale: string = 'hu-HU'): unknown {
    if (value === null || value === undefined) {
      return '-';
    }
    const date = new Date(value);
    return date.toLocaleString(locale);
  }

}
