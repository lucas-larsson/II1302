#include <WiFi.h>
#include <WiFiServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "thingProperties.h"

/* Network connections */
const char* ssid = "Natrium50";
const char* password = "Molodets100";
const char* apiURL = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/update"; // API URL for ESP32 to send a post request to
const char* espURL = "http://193.10.38.237"; //Don't need to use atm

/* IoT Cloud */
const char THING_ID[] = "d7a62a2c-9ad4-4443-8c7f-162bf6bb10da"; // Thing ID used to authenticate the connected device with cloud IoT
const char DEVICE_ID[] = "264ca76b-f1d2-47ba-9379-4f34725035c8";  // Device ID which is connected with cloud IoT
const char DEVICE_PSW[] = "E6KPUM47BNZ8RQWQHYQ3"; // Device secret password to connect with the device

char api_server[] = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/";  // API URL used to for ESP32 to listen too
char endpoint[] = "/api/data/"; // end point which yet has to be stated


/* origin setting on ESP32 */
int plantMoist = 0;
bool currentAutoMode = true;
bool currentWater = false;

/* TEST - variabels to update */ 
int m;  
bool a_m;
bool btn;

/* Pin connections */
const int moistureSensorPin = 33;
const int pumpControlPin = 19;
const int LED_R = 12;
const int LED_G = 13;
const int LED_Y = 14;

/* Time related variabels */
unsigned long lastTime = 0;
unsigned long timerDelay = 6000;


WiFiClient client;
HTTPClient http;
WiFiServer server(80); //create a new web server listening on port 80

void setup() 
{
  Serial.begin(115200);
  initProperties();
  
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
  
  Serial.println("");
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  setDebugMessageLevel(2);
  server.begin();
  Serial.println("Timer set to 10 minutes (timerDelay variable), it will take 10 minutes before publishing the first reading.");
}

void loop() 
{
  WiFiClient client = server.available(); //check for incoming client connections

  if (client) 
  {
    Serial.println("New client connected!");
    String currentLine = "";
    while (client.connected()) 
    {
      if (client.available()) 
      {
        char c = client.read();
        if(c == '\n')
        {
          break; // End of HTTP request header
        }
        else if (c != '\r')
        {
          currentLine += c;
        }
      }
    }

    if (currentLine.startsWith("POST " + String(endpoint))) 
    {
      Serial.println("Received POST request");
      // Parse JSON payload
      String jsonPayload = client.readStringUntil('\n');
      Serial.println("Received JSON payload: " + jsonPayload);
      DynamicJsonDocument doc(256);
      DeserializationError error = deserializeJson(doc, jsonPayload);
      Serial.println(error.c_str());
    
      if (error) 
      {
        Serial.println("Failed to deserialize JSON body");
      } 
      else 
      {
        if (doc.containsKey("Moistlevel")) 
        {
          m = doc["Moistlevel"];
        }
        if (doc.containsKey("AutoMode")) 
        {
          a_m = doc["AutoMode"];
        }
        if (doc.containsKey("water")) 
        {
          btn = doc["water"];
        }
        
        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: text/html");
        client.println("Connection: close"); 
        client.println();
        client.println("Received JSON payload:");
        client.println(jsonPayload);
      }
    }
    else
    {
      Serial.println("Invalid HTTP request");
      client.println("HTTP/1.1 404 Not Found");
      client.println("Content-Type: text/html");
      client.println("Connection: close");
      client.println();
      client.println("Invalid HTTP request");
    }
    delay(1);
    client.stop(); //close the client connection
    Serial.println("Client disconnected");
   }
  ArduinoCloud.update();

  if ((millis() - lastTime) > timerDelay) 
  {
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

  if(currentAutoMode == true)
  {
    if(moistureLevel < plant_moist || currentWater == true)
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
          currentWater = false; //reset water button          
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
  

  if(currentAutoMode == false)
  {
    if(currentWater == true)
    {
      while (true)
      {
        moistureLevel = readMoistureLevel();
        digitalWrite(pumpControlPin, HIGH);
 
        if(moistureLevel >= plant_moist)
        {
          digitalWrite(pumpControlPin, LOW);
          currentWater = false; //reset water button  
          break;
        }
        delay(1000);
      }
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
    jsonDoc["last_watered"] = ("2023-04-25 15:30:00");
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
