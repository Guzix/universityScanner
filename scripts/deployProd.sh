#!/bin/bash

IP="10.7.1.36"
PORT="2020"
LOGIN="root"

target_dir="/root/Production"

pushd ..

echo "Closing Running Instance"
ssh "$LOGIN@$IP" -p "$PORT" "screen -X -S Production quit"
#ssh "$LOGIN@$IP" -p "$PORT" "systemctl stop cov-detector-server"
ssh "$LOGIN@$IP" -p "$PORT" "cp ${target_dir}/Production.jar ${target_dir}/Production.jar.BAK"

echo "Uploading Distribution"
scp -P "$PORT" "target/Production.jar" "$LOGIN@$IP":"${target_dir}/Production.jar"

echo "Starting Instance"
ssh "$LOGIN@$IP" -p "$PORT" "${target_dir}/startInScreen.sh"
#ssh "$LOGIN@$IP" -p "$PORT" "systemctl start cov-detector-server"

echo "Done"
