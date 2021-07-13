public with sharing class CurrencyCalculator_Ctrl {
  private final static String API_URL = 'https://api.ratesapi.io/api/latest';
  @AuraEnabled
  public static String getCurrencyData() {
    Pinned_currencies__c pc = UserCurrencyFavourites.getFavourites();
    CurrencyDataModel model = new CurrencyDataModel();
    model.baseDefault = pc.Default_Currency__c;
    model.favourites = pc.Currencies__c;
    model.rates = getRates(model.baseDefault);

    return JSON.serialize(model);
  }

  @AuraEnabled(cacheable=true)
  public static Map<String, Object> getRates(String baseCurrency) {
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
    if (!String.isBlank(strResponse)) {
      mapJsonData = (Map<String, Object>) JSON.deserializeUntyped(strResponse);
    }

    if (!mapJsonData.isEmpty()) {
      return mapJsonData;
    } else {
      return null;
    }
  }

  @AuraEnabled
  public static Map<String, Object> setDefaultCurrency(String defaultCurrency) {
    Map<String, Object> rates = getRates(defaultCurrency);
    UserCurrencyFavourites.setDefaultCurrency(defaultCurrency);

    return rates;
  }

  public class CurrencyDataModel {
    Map<String, Object> rates;
    String baseDefault;
    String favourites;
  }
}
