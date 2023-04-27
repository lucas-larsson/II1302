#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>

const char* ssid = "Deantz";
const char* password = "Danne117";
const char* serverUrl = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/update";
bool automatic = false;

const int moistureSensorPin = 33;
const int pumpControlPin = 4;
const int pumpOnThreshold = 450; // !Should be variable. At start empty. Will be set to value received from API in JSON.

unsigned long lastTime = 0;
unsigned long timerDelay = 6000;

void setup() 
{
  Serial.begin(115200);

  pinMode(pumpControlPin, OUTPUT);
  digitalWrite(pumpControlPin, LOW);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  
  while(WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Timer set to 10 minutes (timerDelay variable), it will take 10 minutes before publishing the first reading.");
}

void loop() 
{
  if ((millis() - lastTime) > timerDelay) 
  {
    int moistureLevel = readMoistureLevel();
    controlMotorPump(moistureLevel, 480);
    updatePlantMoistureLevel(moistureLevel);
    lastTime = millis();
  }
}

int readMoistureLevel() 
{
  long sensorValue = analogRead(moistureSensorPin);
  int moistureLevel = map(sensorValue, 0, 800, 0, 100);
  Serial.print("Moisture level: ");
  Serial.println(moistureLevel);
   Serial.println("%");
  return moistureLevel;
}


void controlMotorPump(int moistureLevel, int threshold) 
{
  int plant_moist = threshold;
  
  if (moistureLevel < pumpOnThreshold) 
  {
    while (true)
    {
      moistureLevel = readMoistureLevel();
      if(moistureLevel < plant_moist)
      {
        Serial.println("Pump on");
        digitalWrite(pumpControlPin, HIGH);
      }
      if(moistureLevel >= plant_moist)
      {
        digitalWrite(pumpControlPin, LOW);
        break;
      }
      delay(100);
    }
  }
  else 
  {
    Serial.println("Pump off");
    digitalWrite(pumpControlPin, LOW);
  }
}

void updatePlantMoistureLevel(int moistureLevel) 
{
  if (WiFi.status()== WL_CONNECTED) 
  {
 
    // Create a JSON object
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["moisture_level"] =  300;
    jsonDoc["last_watered"] = "2023-04-25 15:30:00";
    jsonDoc["iot_device_id"] = 123;
    jsonDoc["iot_device_password"] = "password";
   

    // Serialize the JSON object to a string
    String jsonString;
    serializeJson(jsonDoc, jsonString);

    // Send the JSON data to the API endpoint
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonString);
    Serial.printf("HTTP response code: %d\n", httpResponseCode);
    String response = http.getString();
    Serial.println(response);
  
    http.end();
  }
}