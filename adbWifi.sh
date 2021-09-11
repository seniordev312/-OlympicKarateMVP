#!/bin/bash

adb kill-server
adb start-server
adb tcpip 5555

sleep 2

IP_ADDRESS_LINE=$(adb shell ip addr show wlan0 | grep "inet.*wlan0")
echo $IP_ADDRESS_LINE
IP_ADDRESS="$(echo $IP_ADDRESS_LINE | cut -d ' ' -f2 |  cut -d '/' -f1)"
echo "$IP_ADDRESS:5555"

adb connect $IP_ADDRESS:5555

sleep 1

npx react-native run-android