# simple-iot-monitoring
A simple nodejs server to see if your IOT (esp32, esp8266) are still alive

Uddate your credentials in config/data.js

Can easily be use with docker.

```
version: '3'

services:        
    app:
        image: node:lts
        environment:
          - TZ=Europe/Paris
        ports:
          - 8080:3000
        volumes:
          - <path to this app>:/app
        restart: unless-stopped
        user: "node"
        command: bash -c "cd /app ; npm install; npm run startdev"
```


Example Arduino code 
```

...

const char* espHostname = "RFIDESP32";
const char* espType = "ESP32";
const char* espLocation = "Balcon";
const char* espDescription = "Scanner%20RFID%20Balcon";
const char* PingerKey = "3c%2BY43a%2F2z%2Am%243%7DMLN%21%3DE%27%3DKh%2C";
unsigned long PingerDelay = 10000;  
unsigned long PingerDelay_current = millis();  


...


void pingMonitoring() {
 if ((millis() - PingerDelay_current) > PingerDelay) {
    WiFiClientSecure client;    
    
    client.setCACert(rootCABuff);
    HTTPClient http;
    http.setTimeout(1000);

    String request = "https://mydomain.com/ping?name="+(String)espHostname+"&type="+(String)espType+"&location="+(String)espLocation+"&description="+(String)espDescription+"&key="+(String)PingerKey;
    
        

    Serial.print("[HTTPS] begin...\n");
    if (http.begin(client, request.c_str())) {  // HTTPS
      http.addHeader("Accept", "application/json");
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      Serial.print("[HTTPS] GET...\n");
      int httpCode = http.GET();    
      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTPS header has been send and Server response header has been handled
        Serial.printf("[HTTPS] POST... code: %d\n", httpCode);    
        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY || httpCode == HTTP_CODE_MOVED_PERMANENTLY || httpCode == HTTP_CODE_FOUND) {
          Serial.printf("OK Server Updated\n");
        }
      } else {
        Serial.printf("[HTTPS] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }    
      http.end();
    } else {
      Serial.printf("[HTTPS} Unable to connect\n");
    }
    PingerDelay_current=millis();
  }
}


...


void loop() {
  pingMonitoring();
    
  ...  
  
}

```
