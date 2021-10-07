#!/bin/bash

ssh root@10.7.1.36 -p 2020 -q "su - postgres -c 'pg_dump production'" > prod_dump.sql

