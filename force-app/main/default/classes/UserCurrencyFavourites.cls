public with sharing class UserCurrencyFavourites {
  @AuraEnabled
  public static String saveFavourites(String favouritesList) {
    List<Pinned_currencies__c> pc = [
      SELECT Id, OwnerId, Currencies__c
      FROM Pinned_currencies__c
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
  public static String getFavourites() {
    List<Pinned_currencies__c> pc = [
      SELECT Id, OwnerId, Currencies__c
      FROM Pinned_currencies__c
    ];
    Pinned_currencies__c currentFavourites = null;
    if (pc == null || pc.isEmpty()) {
      currentFavourites = new Pinned_currencies__c(Currencies__c = '');
    } else {
      currentFavourites = pc[0];
    }
    return currentFavourites.Currencies__c;
  }
}
