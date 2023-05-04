#include <WiFi.h>
#include <WiFiServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Deantz";
const char* password = "Danne117";
const char* apiURL = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/update";
const char* espURL = "http://192.168.1.10";

bool auto_mode = true;
bool water;
const char* Secret_Key = "JNOJZGVRAIGAEHIPO2RN";
const char* device_ID = "17d1acab-7a85-41a2-8055-d9df7c81f90e";

const int moistureSensorPin = 33;
const int pumpControlPin = 19;
int plantMoist = 0;

const int LED_R = 12;
const int LED_G = 13;
const int LED_Y = 14;

unsigned long lastTime = 0;
unsigned long timerDelay = 600000;

WiFiServer server(80);

void setup() 
{
  Serial.begin(115200);
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_Y, OUTPUT);
  pinMode(pumpControlPin, OUTPUT);
  digitalWrite(pumpControlPin, LOW);
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  server.begin();
  Serial.println("Timer set to 10 minutes (timerDelay variable), it will take 10 minutes before publishing the first reading.");
}

void loop() 
{
  WiFiClient client = server.available();

  if (client)
  {
    Serial.println("New Client connected");
    
    while (!client.available()) 
    {
      delay(1);
    }  

    // Read HTTP request from client
    String request = client.readStringUntil('\r');
    client.flush();

    // Parse HTTP request to get URL and HTTP method
    String url = "";
    String method = "";
    int idx1 = request.indexOf(" ");
    int idx2 = request.indexOf(" ", idx1+1);
    
    if (idx1 != -1 && idx2 != -1) 
    {
      method = request.substring(0, idx1);
      url = request.substring(idx1 + 1, idx2);
    }
    
    Serial.println("Method: " + method);
    Serial.println("URL: " + url);

    if (method == "POST" && url == "/data") 
    {
      // Read JSON data from HTTP POST request
      String json_string = "";
      while (client.available()) 
      {
        json_string += (char) client.read();
      }
      
      // Parse JSON data and extract variables
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, json_string);
      bool water = doc["water"];
      bool auto_mode = doc["auto_mode"];
      int plantMoist = doc["plantMoist"];

      // Close connection with client
      client.stop();


      HTTPClient http;
      http.begin(apiURL);
      http.addHeader("Content-Type", "application/json");

      String json_data = "{\"water\":" + String(water) + ",\"auto_mode\":" + String(auto_mode) + ",\"plantMoist\":" + String(plantMoist) + "}";
      int http_code = http.POST(json_data);

      if (http_code > 0) 
      {
        String response = http.getString();
        Serial.println("API response: " + response);
      } 
      else 
      {
        Serial.println("HTTP request failed");
      }

      http.end();
    } 
    else 
    {
      // Send HTTP 404 Not Found response for any other URL
      client.println("HTTP/1.1 404 Not Found");
      client.println("Content-Type: text/html");
      client.println();
      client.println("<h1>404 Not Found</h1>");
      client.stop();
    }
  }

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

  if(auto_mode == true)
  {
    if(moistureLevel < plant_moist || water == true)
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
  

  if(auto_mode == false)
  {
    if(water == true)
    {
      while (true)
      {
        moistureLevel = readMoistureLevel();
        digitalWrite(pumpControlPin, HIGH);
 
        if(moistureLevel >= plant_moist)
        {
          digitalWrite(pumpControlPin, LOW);
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