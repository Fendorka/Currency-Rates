public inherited sharing class getCurrency {
  private final static String API_URL = 'https://api.ratesapi.io/api/latest';

  @AuraEnabled
  public static Map<String, Object> getCurrency(String baseCurrency) {
    String requestURL =
      API_URL + (baseCurrency != null ? '?base=' + baseCurrency : '');

    HttpRequest httpRequest = new HttpRequest();
    httpRequest.setEndpoint(requestURL);
    httpRequest.setMethod('GET');
    httpRequest.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());
    httpRequest.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());

    String strResponse = null;
    try {
      Http http = new Http();
      HttpResponse httpResponse = http.send(httpRequest);

      while (httpResponse.getStatusCode() == 302) {
        httpRequest.setEndpoint(httpResponse.getHeader('Location'));
        httpResponse = new Http().send(httpRequest);
      }

      if (httpResponse.getStatusCode() == 200) {
        strResponse = httpResponse.getBody();
      } else {
        throw new CalloutException(httpResponse.getBody());
      }
    } catch (Exception ex) {
      throw ex;
    }

    Map<String, Object> mapJsonData = new Map<String, Object>();
    // List<String> currencyList = new List<String>();
    if (!String.isBlank(strResponse)) {
      mapJsonData = (Map<String, Object>) JSON.deserializeUntyped(strResponse);
      // mapJsonData.put('test', 'myvalue');
      // mapJsonData.put('currencyList', validCurrency);
      // Object rates = mapJsonData.get('rates');
      // currencyList = rates.map(rate => rate.currency);
      System.debug('mapJsonData ===> ' + mapJsonData);
    }

    // Currency_List__mdt

    if (!mapJsonData.isEmpty()) {
      return mapJsonData;
    } else {
      return null;
    }
  }
}
