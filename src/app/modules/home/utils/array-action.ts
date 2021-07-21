export function clearArray(array: Array<any>): void {
  array = [];
}

export function clearDeepArray(obj: object, key: string): void {
  obj[key] = [];
}
