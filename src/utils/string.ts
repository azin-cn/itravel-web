export function limitLength(min: number, max: number) {}

export function limitMaxLength(str: string, max = 24): string {
  if (str.length > max) {
    return `${str.substring(0, max)}...`;
  }
  return str;
}
