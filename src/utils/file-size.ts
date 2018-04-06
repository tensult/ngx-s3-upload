
/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Example:
 *   formats to: 1 KB
*/

export class FileSizeUtil {

  static transform(bytes: number = 0, precision: number = 2): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1000,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(precision)) + ' ' + sizes[i];
  }
}