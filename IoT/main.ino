#include <WiFi.h>
#include <WiFiServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"


#define true 1
#define false 0

/* Network connections */
#define WIFI_SSID      "KTH-IoT"
#define WIFI_PASSWORD  "H2Oasis12"
#define API_KEY       "AIzaSyAMEovzq4Oki0_d53vcCxJ31MjbyimNHOM"  //"AIzaSyBh6kUYOBsEJ-fZxbeTRuKmZ26CfdXzn1M"
#define DATABASE_URL  "https://h2oasis-14cd1-default-rtdb.europe-west1.firebasedatabase.app/"   //"https://testii1302-default-rtdb.europe-west1.firebasedatabase.app/"

/* Pin connections */
const int moistureSensorPin = 33;
const int pumpControlPin = 19;
const int LED_R = 12;
const int LED_G = 13;
const int LED_Y = 14;

/* Firebase objects */
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;
int ldrData = 0;
float voltage = 0.0;

const char* apiURL = "https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/plants/update"; // API URL for ESP32 to send a post request to
const char* espURLs = "http://192.16.146.162/settings"; // NOTICE!!! This is going to be used to send the POST request too.
const char* espURLw = "http://192.16.146.162/shower"; // Send a post request to this URL to water the plant


/* IoT Cloud */
const char THING_ID[] = "d7a62a2c-9ad4-4443-8c7f-162bf6bb10da"; // Thing ID used to authenticate the connected device with cloud IoT
const char DEVICE_ID[] = "264ca76b-f1d2-47ba-9379-4f34725035c8";  // Device ID which is connected with cloud IoT
const char DEVICE_PSW[] = "E6KPUM47BNZ8RQWQHYQ3"; // Device secret password to connect with the device

 
/* origin setting on ESP32 */
int threshold = 25;
bool autoMode = false;
bool waterBTN = false;
  
/*Upadeted variabels */

/* Time related variabels */
unsigned long sendDataPrevMillis = 0;
unsigned long lastTime = 0;
unsigned long timerDelay = 10000;
String last_watered = "2023-05-12T12:31:05Z";

/* NTP client (get current time and date) */
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
String formattedDate;
String dayStamp;
String timeStamp;


WiFiClient client;
HTTPClient http;


void setup() 
{
  Serial.begin(115200);
  //initProperties();
  
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_Y, OUTPUT);
  pinMode(pumpControlPin, OUTPUT);
  digitalWrite(pumpControlPin, LOW);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(300);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi with IP: ");
  Serial.println(WiFi.localIP());
   
  /* Initialize Firebase */
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if(Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("signUp OK");
    signupOK = true;
  }
  else
  {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);


  Serial.println("Timer set to 10 minutes (timerDelay variable), it will take 10 minutes before publishing the first reading.");
  

  /* Initialize a NTPClient and to get time */
  timeClient.begin();
  // Set offset time in seconds to adjust for your timezone, for example:
  // GMT +2 = 7200
  // GMT +1 = 3600
  // GMT +8 = 28800
  // GMT -1 = -3600
  // GMT 0 = 0
  timeClient.setTimeOffset(14400);
}

void loop() 
{
  
 
  if(Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0))
  {
    Serial.println("");
    Serial.println("----------------------------------------------");
    Serial.println("|  FIREBASE INFORMATION |");
    Serial.println("----------------------------------------------");
    sendDataPrevMillis = millis();

    if(Firebase.RTDB.getInt(&fbdo, "/DesiredMoistLevel/Threshold/"))
    {
      if(fbdo.dataType() == "int")
      {
        int updatedTreshold = fbdo.intData();
        Serial.println("Plant moist level is set to " + fbdo.dataPath() + ": " + updatedTreshold + " (" + fbdo.dataType() + ") ");
      }
      else
      {
        Serial.println("FAILED to update! " + fbdo.errorReason());
      }
    }

    if(Firebase.RTDB.getBool(&fbdo, "/Mode/Automatic/"))
    {
      if(fbdo.dataType() == "boolean")
      {
        bool setMode = fbdo.boolData();
        autoMode = setMode;
        Serial.println(" Automode is set to: " + fbdo.dataPath() + ": " + setMode + " (" + fbdo.dataType() + ") ");
      }
      else
      {
        Serial.println("FAILED to update! " + fbdo.errorReason());
      }
    }

    if(Firebase.RTDB.getBool(&fbdo, "/Shower/"))
    {
      if(fbdo.dataType() == "boolean")
      {
        bool shower = fbdo.boolData();
        waterBTN = shower;
        if(waterBTN == true)
        {
          waterPlant();
          waterBTN = false;
          if(Firebase.RTDB.setBool(&fbdo, "/Shower/", waterBTN))
          {
            Serial.print(" - successfully replenished soil moisture. shower set to: " + fbdo.dataPath());
          }
          else
          {
            Serial.println("FAILED: " + fbdo.errorReason());
          }
        }
        Serial.println(" " + fbdo.dataPath() + ": " + shower + " (" + fbdo.dataType() + ") ");
      }
      else
      {
        Serial.println("FAILED to update! " + fbdo.errorReason());
      }
    }
    Serial.println("----------------------------------------------");
    Serial.println("");
  }
  /* Update current time and date */
  while(!timeClient.update()) 
  {
    timeClient.forceUpdate();
  }
  // The formattedDate comes with the following format:
  // 2018-05-28T16:00:13Z
  // We need to extract date and time
  
 

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
    controlMotorPump(moistureLevel, threshold);
    updatePlantMoistureLevel(moistureLevel);
    
    lastTime = millis();
  }
}



void waterPlant()
{
  int moistureLevel = readMoistureLevel();
  if(moistureLevel >= 70)
  {
    Serial.println("");
     Serial.println("----------------------------------------------");
    Serial.println("DON'T DROWN YOUR PLANT!");
    Serial.println("Showering plant refused by IoT! Try again later!");
     Serial.println("----------------------------------------------");
    Serial.println("");
    Serial.println("");
    return;
  }
  /*
  while (moistureLevel < 100)
  {
    moistureLevel = readMoistureLevel();
    Serial.println("Shower in progress!");
    digitalWrite(pumpControlPin, HIGH);
  }
  */
  else
  {
  digitalWrite(pumpControlPin, HIGH); 
  delay(1000);
  digitalWrite(pumpControlPin, LOW);
  Serial.println("Shower finished! soil moisture level suffucient!");
  last_watered = timeClient.getFormattedDate();
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
          last_watered = timeClient.getFormattedDate();
          Serial.println(last_watered);
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
  
  if(autoMode == false)
  {
    if(moistureLevel < plant_moist)
    {
      Serial.println("");
      Serial.println("----------------------------------------------");
      Serial.println("");
      
     
      Serial.print("SOIL IS DRY! PLEASE WATER THE PLANT!");
      Serial.println("");
      Serial.println("");
      Serial.println("----------------------------------------------");
    
    }
    else
    {
      return;
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
    jsonDoc["last_watered"] = last_watered;
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
