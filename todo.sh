#!/bin/bash

grep --color=always -r "TODO" --exclude={todo.sh} --exclude-dir={node_modules,.git} .

