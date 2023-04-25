#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "eduroam";
const char* password = "5dMZmVnhs";

const int moistureSensorPin = 33;
const int pumpControlPin = 4;
const int pumpOnThreshold = 450; // Adjust this value based on your sensor readings

unsigned long lastTime = 0;
unsigned long timerDelay = 60;

void setup() 
{
  Serial.begin(115200);

  pinMode(pumpControlPin, OUTPUT);
  digitalWrite(pumpControlPin, LOW);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  /*
  while(WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  */
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

int readMoistureLevel() {
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
    serverUrl += moistureLevel;

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
