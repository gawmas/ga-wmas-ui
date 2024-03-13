import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'wxCondIcon',
  standalone: true
})
export class WxConditionIconPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(url: string): string {
    // Split the URL by '/' to extract the last part which is the filename
    const parts = url.split('/');
    const filename = parts[parts.length - 1];

    // Extract the name part by removing the file extension and 'wsymbol_' prefix
    const nameWithExtension = filename.split('.')[0];
    const nameWithoutPrefix = nameWithExtension.split('_').slice(1).join('_');

    return './assets/wx-svgs/line/' + nameWithoutPrefix.substring(nameWithoutPrefix.indexOf('_')+1, nameWithoutPrefix.length) + '.svg';
  }

}
