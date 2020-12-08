import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'enumSelect'})
export class EnumSelectPipe implements PipeTransform {
  transform(value) : any {
    let keys = [];
    for (var enumMember in value) {
        keys.push({key: enumMember, value: value[enumMember]});
    }
    return keys;
  }
}
