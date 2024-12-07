#! /bin/bash
echo "리눅스가 재미있나요? (yes / no)"
read input
case "$input" in
    Y|*YES*|*Yes*|y|*yes*)
        echo "yes"
    ;;
    N|*NO*|*No*|n|*no*)
        echo "no"
    ;;
    *)
        echo "yes or no로 입력해주세요"
    ;;
esac
exit 0