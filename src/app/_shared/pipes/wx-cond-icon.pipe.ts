import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wxCondIcon',
  standalone: true
})
export class WxConditionIconPipe implements PipeTransform {

  transform(url: string): string {
    // Split the URL by '/' to extract the last part which is the filename
    const parts = url.split('/');
    const filename = parts[parts.length - 1];

    // Extract the name part by removing the file extension and 'wsymbol_' prefix
    const nameWithExtension = filename.split('.')[0];
    const nameWithoutPrefix = nameWithExtension.split('_').slice(1).join('_');

    return './assets/wx-svgs/fill/' + nameWithoutPrefix.substring(nameWithoutPrefix.indexOf('_')+1, nameWithoutPrefix.length) + '.svg';
  }

}
