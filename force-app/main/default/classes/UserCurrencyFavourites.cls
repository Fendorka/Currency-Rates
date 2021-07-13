public with sharing class UserCurrencyFavourites {
  private final static String DEFAULT_BASE_CURRENCY = 'EUR';
  @AuraEnabled
  public static String saveFavourites(String favouritesList) {
    List<Pinned_currencies__c> pc = [
      SELECT OwnerId, Currencies__c
      FROM Pinned_currencies__c
      WHERE OwnerId = :UserInfo.getUserId()
    ];
    Pinned_currencies__c currentFavourites = null;
    if (pc == null || pc.isEmpty()) {
      currentFavourites = new Pinned_currencies__c();
    } else if (pc.size() == 1) {
      currentFavourites = pc[0];
    } else {
      new AuraHandledException('User has more than one favourites list.');
      currentFavourites = pc[0];
      pc.remove(0);
      delete pc;
    }
    currentFavourites.Currencies__c = favouritesList;
    upsert currentFavourites;
    return [SELECT Currencies__c FROM Pinned_currencies__c].Currencies__c;
  }

  @AuraEnabled
  public static Pinned_currencies__c getFavourites() {
    List<Pinned_currencies__c> pc = [
      SELECT OwnerId, Currencies__c, Default_Currency__c
      FROM Pinned_currencies__c
      WHERE OwnerId = :UserInfo.getUserId()
    ];
    Pinned_currencies__c currentFavourites = null;
    if (pc == null || pc.isEmpty()) {
      currentFavourites = new Pinned_currencies__c(
        Currencies__c = '',
        Default_Currency__c = DEFAULT_BASE_CURRENCY
      );
    } else {
      currentFavourites = pc[0];
    }
    return currentFavourites;
  }

  @AuraEnabled
  public static String setDefaultCurrency(String defaultCurrency) {
    List<Pinned_currencies__c> pc = [
      SELECT OwnerId, Default_Currency__c
      FROM Pinned_currencies__c
      WHERE OwnerId = :UserInfo.getUserId()
    ];
    Pinned_currencies__c currentFavourites = null;
    if (pc == null || pc.isEmpty()) {
      currentFavourites = new Pinned_currencies__c();
    } else if (pc.size() == 1) {
      currentFavourites = pc[0];
    } else {
      new AuraHandledException('User has more than one default currency.');
      currentFavourites = pc[0];
      pc.remove(0);
      delete pc;
    }
    if (defaultCurrency == null || String.isBlank(defaultCurrency)) {
      defaultCurrency = DEFAULT_BASE_CURRENCY;
    }
    currentFavourites.Default_Currency__c = defaultCurrency;
    upsert currentFavourites;

    return [SELECT Default_Currency__c FROM Pinned_currencies__c]
    .Default_Currency__c;
  }
}
