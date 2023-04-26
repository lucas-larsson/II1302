#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "Deantz";
const char* password = "Danne117";

const int moistureSensorPin = 33;
const int pumpControlPin = 4;
const int pumpOnThreshold = 450; // Adjust this value based on your sensor readings
int lastTimeO = 0;

unsigned long lastTimeWatered = 0;
unsigned long timerDelay = 6000;

void setup() 
{
  Serial.begin(115200);

  pinMode(pumpControlPin, OUTPUT);
  digitalWrite(pumpControlPin, LOW);

  // print the MAC address to the serial monitor:
  Serial.print("MAC Address: ");
  Serial.println(WiFi.macAddress());

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
    controlMotorPump(moistureLevel);
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
  return moistureLevel;
}

void controlMotorPump(int moistureLevel) 
{
  if (moistureLevel < pumpOnThreshold) 
  {

    digitalWrite(pumpControlPin, HIGH);
    Serial.println("Pump on");
  } 
  else 
  {
    digitalWrite(pumpControlPin, LOW);
    Serial.println("Pump off");
  }
}

void updatePlantMoistureLevel(int moistureLevel) 
{
  if (WiFi.status()== WL_CONNECTED) 
  {
    WiFiClient client;
    HTTPClient http;
 
    String serverUrl = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/update/";
    serverUrl += "?moistureLevel=";
    serverUrl +=;


    // Create a JSON object
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["moisture_value"] =  moistureLevel;
    jsonDoc["device_id"] = "94:E6:86:A7:AB:88";
    jsonDoc["last_watered"] = "2023-04-25 15:30:00";

    // Serialize the JSON object to a string
    String jsonString;
    serializeJson(jsonDoc, jsonString);

    // Make an HTTP POST request to the API endpoint
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonString);
    String response = http.getString();
    http.end();

    // Print the HTTP response
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.print("Server response: ");
    Serial.println(response);

    delay(5000); // Wait for 5 seconds before sending another request
   

    http.begin(client, serverUrl.c_str());
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) 
    {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } 
    else 
    {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}





  