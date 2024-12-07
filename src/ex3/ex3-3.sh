#! /bin/bash
kg=$1
cm=$(echo "$2; 100" |awk '{printf "%f", $1 / $2}')
tem=$(echo "$cm; $cm" |awk '{printf "%f", $1 * $2}')
bmi=$(echo "$kg; $tem" |awk '{printf "%.1f", $1 / $2}')

if awk "BEGIN {exit !($bmi < 18.5)}"; then
    echo "저체중입니다."
elif awk "BEGIN {exit !($bmi >= 23.0)}"; then
    echo "과체중입니다."
else
    echo "정상제중 입니다."
fi
exit 0