#! /bin/bash
file_name="DB.txt"
if [ ! -f $file_name ]; then
    touch $file_name
fi

echo "$@" >> $file_name
exit 0