#!/bin/bash

local_dir="ts-api"
target_dir="../react-module/src/openapi"

rm -r ${target_dir:?}/*
rm -r ${local_dir:?}/*

java -jar swagger-codegen-cli-3.0.27.jar generate \
		-i http://localhost:8087/v3/api-docs \
		-l typescript-axios \
		-o "${local_dir}"

mkdir "${target_dir}"
cp -r ${local_dir}/* "${target_dir}"
rm -r ${local_dir:?}/*
