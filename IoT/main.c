include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>

const char* ssid = "eduroam";
const char* password = "5dMZmVnhs";
const char* ssid = "Deantz";
const char* password = "Danne117";
const char* serverUrl = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/update";
bool automatic = false;

//Your Domain name with URL path or IP address with path
const char* serverName = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/update/";
const int moistureSensorPin = 33;
const int pumpControlPin = 4;
const int pumpOnThreshold = 450; // !Should be variable. At start empty. Will be set to value received from API in JSON.

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;
unsigned long timerDelay = 6000;

void setup()
{
  Serial.begin(115200);

  pinMode(pumpControlPin, OUTPUT);
  digitalWrite(pumpControlPin, LOW);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED)

  while(WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");

  Serial.println("Timer set to 10 minutes (timerDelay variable), it will take 10 minutes before publishing the first reading.");
}

void loop()
{
  //Send an HTTP POST request every 10 minutes
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;

      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      // If you need Node-RED/server authentication, insert user and password below
      //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");

      // Specify content-type header
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      // Data to send with HTTP POST
      String httpRequestData = "api_key=tPmAT5Ab3j7F9&sensor=BME280&value1=24.25&value2=49.54&value3=1005.14";
      // Send HTTP POST request
      // TODO: Change to POST request
      // Here we are using the HTTP POST method to send the data to the server, so maybe just collect the data and send it each 15 minutes?
      int httpResponseCode = http.POST(httpRequestData);

      // If you need an HTTP request with a content type: application/json, use the following:
      //http.addHeader("Content-Type", "application/json");
      //int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");

      // If you need an HTTP request with a content type: text/plain
      //http.addHeader("Content-Type", "text/plain");
      //int httpResponseCode = http.POST("Hello, World!");

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      // Free resources
      http.end();
    }
    else
    {
      Serial.println("WiFi Disconnected");
    }
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

/*
  Since WaterPump is READ_WRITE variable, onWaterPumpChange() is
  executed every time a new value is received from IoT Cloud.
*/
void onWaterPumpChange()  {
  // Add your code here to act upon WaterPump change
}
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