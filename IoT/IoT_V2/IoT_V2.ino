waterBTN#include "arduino_secrets.h"
#include <WiFi.h>
#include <WiFiServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
//#include "thingProperties.h"
#include "ESPAsyncWebServer.h"
#include "AsyncJson.h"

#define true 1
#define false 0

/* Network connections */
const char* ssid = "KTH-IoT";
const char* password = "H2Oasis12";
const char* apiURL = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/update"; // API URL for ESP32 to send a post request to

const char* espURLs = "http://192.16.146.162/settings"; // NOTICE!!! This is going to be used to send the POST request too.

const char* espURLw = "http://192.16.146.162/shower"; // Send a post request to this URL to water the plant

/* IoT Cloud */
const char THING_ID[] = "d7a62a2c-9ad4-4443-8c7f-162bf6bb10da"; // Thing ID used to authenticate the connected device with cloud IoT
const char DEVICE_ID[] = "264ca76b-f1d2-47ba-9379-4f34725035c8";  // Device ID which is connected with cloud IoT
const char DEVICE_PSW[] = "E6KPUM47BNZ8RQWQHYQ3"; // Device secret password to connect with the device

 
/* origin setting on ESP32 */
int plantMoist = 0;
bool autoMode = true;
bool waterBTN = false;
  

/* Pin connections */
const int moistureSensorPin = 33;
const int pumpControlPin = 19;
const int LED_R = 12;
const int LED_G = 13;
const int LED_Y = 14;


/* Time related variabels */
unsigned long lastTime = 0;
unsigned long timerDelay = 10000;


WiFiClient client;
HTTPClient http;
AsyncWebServer server(80);

void setup() 
{
  Serial.begin(115200);
  //initProperties();
  
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_Y, OUTPUT);
  pinMode(pumpControlPin, OUTPUT);
  digitalWrite(pumpControlPin, LOW);
  
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi with IP: ");
  Serial.println(WiFi.localIP());
  //ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  //setDebugMessageLevel(2);
  Serial.println("Timer set to 10 minutes (timerDelay variable), it will take 10 minutes before publishing the first reading.");
  
  server.on("/settings", HTTP_POST, [](AsyncWebServerRequest *request)
  {
    //nothing and dont remove it
  }, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
  {
    StaticJsonDocument<200> doc1;
  
    DeserializationError error = deserializeJson(doc1,(const char*)data);
    if (error) 
    {
      Serial.print("deserializeJson() failed! ");
      Serial.println(error.c_str());
      return;
    } 

    plantMoist = doc1["MoistLevel"];  //Get sensor type value
    autoMode = doc1["AutoMode"]; //Get sensor type value
 
    Serial.println();
    Serial.println("----- NEW DATA FROM CLIENT ----");
 
    Serial.print("New plant Moisture level set: ");
    Serial.println(plantMoist);
 
    Serial.print("Automode has set to: ");
    Serial.println(autoMode); 
    Serial.print("watering status: ");
    Serial.println(waterBTN);
    Serial.println("------------------------------");

    request->send(201, "OK", "Post request recieved");
  });

  /* POST reqest for showering the plant */
  server.on("/shower", HTTP_POST, [](AsyncWebServerRequest *request)
  {
    //nothing and dont remove it
  }, NULL, [](AsyncWebServerRequest *request, uint8_t *data2, size_t len, size_t index, size_t total)
  {
    StaticJsonDocument<200> doc2;
  
    DeserializationError error = deserializeJson(doc2,(const char*)data2);
    if (error) 
    {
      Serial.print("deserializeJson() failed! ");
      Serial.println(error.c_str());
      return;
    } 
    waterBTN = doc2["water"];
 
    Serial.println();
    Serial.println("----- NEW DATA FROM CLIENT ----");
 
    Serial.print("watering status: ");
    Serial.println(waterBTN);
    Serial.println("------------------------------");

    request->send(201, "OK", "Post request recieved and let it rain");
  
  });  

  server.begin();
}

void loop() 
{
   
  /* If button is pressed then water a few seconds and turn off. */
  
 

  if ((millis() - lastTime) > timerDelay) 
  { 
    digitalWrite(pumpControlPin, LOW);
    waterBTN == false;   
    int moistureLevel = readMoistureLevel();
    if( moistureLevel <= 20)
    {
      digitalWrite(LED_R, HIGH);
      digitalWrite(LED_G, LOW);
      digitalWrite(LED_Y, LOW);
    }

    if( moistureLevel > 20 && moistureLevel <= 55 )
    {
      digitalWrite(LED_R, LOW);
      digitalWrite(LED_G, LOW);
      digitalWrite(LED_Y, HIGH);
    }
    if( moistureLevel > 55)
    {
      digitalWrite(LED_R, LOW);
      digitalWrite(LED_G, HIGH);
      digitalWrite(LED_Y, LOW);
    }
    controlMotorPump(moistureLevel, plantMoist);
    updatePlantMoistureLevel(moistureLevel);
    
    lastTime = millis();
  }
}

/*
void waerPlant()
{
  if(waterBTN == true)
  {
    digitalWrite(pumpControlPin, HIGH);
    delay(50);
    digitalWrite(pumpControlPin, LOW);
    waterBTN == false;    
  }
}
*/

int readMoistureLevel() 
{
  long sensorValue = analogRead(moistureSensorPin);
  int moistureLevel = map(sensorValue, 4095, 0, 0, 100);
  int moistPercent = map(moistureLevel, 0, 28, 0, 100);
  Serial.print("Moisture level: ");
  Serial.print(moistPercent);
  Serial.println("%");
  return moistPercent;
}


void controlMotorPump(int moistureLevel, int threshold) 
{
  int plant_moist = threshold;
  if(autoMode == true)
  {
    if(moistureLevel < plant_moist)
    {
      Serial.println("Turn pump on!!");
      while (true)
      {
        moistureLevel = readMoistureLevel();
        
        digitalWrite(pumpControlPin, HIGH);
 
        if(moistureLevel >= plant_moist)
        {
          digitalWrite(pumpControlPin, LOW);
          digitalWrite(LED_R, LOW);
          digitalWrite(LED_Y, LOW);
          digitalWrite(LED_G, HIGH);
          waterBTN = false; //reset water button
          break;
        }
        delay(1000);
      }
    }
    else 
    {
      Serial.println("Pump off");
      digitalWrite(pumpControlPin, LOW);
    }
  }
  else
  {
    if(moistureLevel < plant_moist)
    {
      Serial.print("Soil is dry! Please water the plant!");
    }
  }
}


void updatePlantMoistureLevel(int moistureLevel) 
{
  if (WiFi.status()== WL_CONNECTED) 
  {
 
    // Create a JSON object
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["moisture_level"] =  moistureLevel;
    jsonDoc["last_watered"] = "2023-04-25 15:30:00";
    jsonDoc["iot_device_id"] = 123;
    jsonDoc["iot_device_password"] = "password";
   

    // Serialize the JSON object to a string
    String jsonString;
    serializeJson(jsonDoc, jsonString);

    // Send the JSON data to the API endpoint
    HTTPClient http;
    http.begin(apiURL);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonString);
    Serial.printf("HTTP response code: %d\n", httpResponseCode);
    String response = http.getString();
    Serial.println(response);
  
    http.end();
  }
}
