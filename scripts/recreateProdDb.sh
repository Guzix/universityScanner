#!/bin/bash

IP="10.7.1.36"
PORT="2020"
LOGIN="root"

target_dir="/root/Production"
ssh "$LOGIN@$IP" -p "$PORT" "screen -X -S Production quit"
ssh "$LOGIN@$IP" -p "$PORT" "${target_dir}/recreateDb.sh"
