#! /bin/bash
repeat=`expr 100000000 \* 100000000`
if (( $1 < $repeat )); then
    repeat=$1
fi

for((i=0;i<$repeat;i++)); do
    echo "hello world"
done
exit 0