#! /bin/bash
if [[ $2 == + ]]; 
then
    echo `expr $1 + $3`
else
    echo `expr $1 - $3`
fi
exit 0