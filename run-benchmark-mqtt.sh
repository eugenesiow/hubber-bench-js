for ((n=$1;n<$2;n++))
do
	node mqtt-pi.js $n $3 $4 $5
done
