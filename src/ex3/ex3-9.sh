#! /bin/bash
file_name="DB.txt"
query="$@"
i=1
while read line || [ -n "$line" ] ; do
  if [[ "$line" == *"$query"* ]]; then
    echo "$line"
  fi
  ((i+=1))
done < $file_name
exit 0