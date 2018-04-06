export class URLUtil {
    static toQueryParamString(params?: any) {
      console.log(JSON.stringify(params));
      let queryString = '';
      if (params) {
        for (const param of Object.keys(params)) {
          queryString += `${param}=${params[param]}&`;
          console.log(JSON.stringify(param));
        }
      }
      console.log(queryString);
      return queryString;
    }
    static getBaseUrl() {
      const currHref = window.location.href;
      const baseUrlLastIndex = currHref.split('#')[0].lastIndexOf('/');
      return currHref.substring(0, baseUrlLastIndex);
    }
  };
  