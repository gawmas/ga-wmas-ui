import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'detailsHighlight',
  standalone: true
})
export class DetailsHighlightPipe implements PipeTransform {

  transform(value: string): string {
    // Use regular expression to match "Bonus Deer" or "Sign-in"
    const regex = /(Bonus Deer|Sign-in)/gi;

    // Wrap matching instances in a span with different classes for styling
    if (value && regex && regex !== null) {
      const highlightedText = value.replace(regex, match => {
        return match === 'Bonus Deer' ? '<span class="detail-bonus-deer">[' + match + ']</span>' :
                                        '<span class="detail-sign-in">[' + match + ']</span>';

        });
      return highlightedText;
    }
    return '';

  }

}
