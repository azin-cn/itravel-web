export interface IPrettyBytesOptions {
  accuracy: number;
  units: string[];
}

export const genDefaultOptions = (): IPrettyBytesOptions => {
  return {
    accuracy: 2,
    units: ['B', 'KB', 'MB', 'GB', 'TB'],
  };
};

export const prettyBytes = (
  size: unknown,
  carry = 1024,
  options: IPrettyBytesOptions = genDefaultOptions()
): string => {
  if (size === undefined || size === null) {
    return '-';
  }

  if (typeof size === 'number') {
    let idx = 0;
    options = { ...options, ...genDefaultOptions() };
    const { accuracy, units } = options;

    while (size > carry && idx < units.length - 1) {
      size /= carry;
      idx += 1;
    }

    return idx === 0
      ? `${size?.toFixed(0)} ${units[idx]}`
      : `${size?.toFixed(accuracy)} ${units[idx]}`;
  }

  /**
   * throw errors
   */
  return size.toString();
};
