public inherited sharing class getCurrency {

    @AuraEnabled
    public static map<String, Object> getCurrency(String URL){
        map<String, Object> mapJsonData = new map<String, Object>();
        String strResponse = null;
        if(String.isNotBlank(URL)) {
            HttpRequest httpRequest = new HttpRequest();  
            httpRequest.setEndpoint(URL);

            httpRequest.setMethod('GET');   
            httpRequest.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
            httpRequest.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId()); 
            
            try {  
                Http http = new Http();   
                HttpResponse httpResponse = http.send(httpRequest);  

                while(httpResponse.getStatusCode() == 302) {
                    httpRequest.setEndpoint(httpResponse.getHeader('Location'));
                    httpResponse = new Http().send(httpRequest);
                }

                if (httpResponse.getStatusCode() == 200 ) {  
                    strResponse = httpResponse.getBody();  
                } 
                else {  
                    throw new CalloutException(httpResponse.getBody());  
                }   
            } 
            catch(Exception ex) {  
                throw ex;  
            }  
        } 

        if(!String.isBlank(strResponse)) {
            mapJsonData = (map<String, Object>)JSON.deserializeUntyped(strResponse);
            System.debug('mapJsonData ===> '+mapJsonData);
        }

        if(!mapJsonData.isEmpty()) {
            return mapJsonData;
        }
        else {
            return null;
        }
    }
}