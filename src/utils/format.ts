export function limitLength(min: number, max: number) {}

export function limitMaxLength(str: string, max = 24): string {
  const width = window.innerWidth;
  /**
   * 响应式，用于处理css无法生成省略号的情况（宽度不固定）
   */
  if (width >= 1536) {
    /**
     * 2xl
     */
    max = 60;
  } else if (width >= 1280) {
    /**
     * xl
     */
    max = 46;
  } else if (width >= 1024) {
    /**
     * lg
     */
    max = 36;
  } else if (width >= 768) {
    /**
     * md
     */
    max = 30;
  } else if (width >= 640) {
    /**
     * sm
     */
    max = 24;
  }

  if (str.length > max) {
    return `${str.substring(0, max)}...`;
  }
  return str;
}

/**
 * 将数字转换为k, w
 * @param num
 * @returns
 */
export function formatNumber(num: number): string {
  if (num >= 1e4) {
    return `${(num / 1e4).toFixed(1)}w+`;
  }
  if (num >= 1e3 && num < 1e4) {
    return `${(num / 1e3).toFixed(1)}k+`;
  }

  return `${num.toFixed(0)}`;
}
