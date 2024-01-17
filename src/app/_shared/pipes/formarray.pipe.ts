import { Pipe, PipeTransform } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";

@Pipe({
  name: 'formArray',
  standalone: true
})
export class FormArrayPipe implements PipeTransform {
    transform(formGroup: FormGroup, key: string): FormArray | null {
      return formGroup.controls[key] as unknown as FormArray;
    }
}
