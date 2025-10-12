/**
 * Utility class for string operations (similar to C# SMStringUtils)
 */
export class StringUtils {
  /**
   * Safely converts value to string
   */
  static toString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  /**
   * Safely converts value to integer
   */
  static toInt(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Safely converts value to boolean
   */
  static toBoolean(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    const strValue = String(value).toLowerCase();
    return strValue === 'true' || strValue === '1';
  }

  /**
   * Safely converts value to decimal/float
   */
  static toDecimal(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Checks if string is null or empty
   */
  static isNullOrEmpty(value: any): boolean {
    return value === null || value === undefined || String(value).trim() === '';
  }

  /**
   * Splits comma-separated string to array of integers
   */
  static toIntArray(value: string): number[] {
    if (this.isNullOrEmpty(value)) {
      return [];
    }
    return value
      .split(',')
      .map(item => this.toInt(item.trim()))
      .filter(num => num > 0);
  }

  /**
   * Checks if value is a valid number
   */
  static isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Truncates string to specified length
   */
  static truncate(value: string, maxLength: number): string {
    if (this.isNullOrEmpty(value)) {
      return '';
    }
    return value.length > maxLength 
      ? value.substring(0, maxLength) + '...' 
      : value;
  }

  /**
   * Converts string to camelCase
   */
  static toCamelCase(value: string): string {
    if (this.isNullOrEmpty(value)) {
      return '';
    }
    return value
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  }
}