#!/usr/bin/env bash
# ponytail: liveness check. YouTube → oembed (catches private/deleted). Else → curl HEAD, GET fallback.
set -uo pipefail
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
check() {
  local url="$1" code
  if [[ "$url" == *"youtube.com/watch"* || "$url" == *"youtu.be/"* || "$url" == *"youtube.com/playlist"* ]]; then
    code=$(curl -s -o /dev/null -w "%{http_code}" -A "$UA" --max-time 20 \
      "https://www.youtube.com/oembed?format=json&url=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$url")")
    echo "$code  [YT]  $url"
    return
  fi
  code=$(curl -s -o /dev/null -w "%{http_code}" -A "$UA" -L --max-time 20 -I "$url")
  if [[ "$code" == "000" || "$code" == "403" || "$code" == "405" || "$code" == "404" ]]; then
    code=$(curl -s -o /dev/null -w "%{http_code}" -A "$UA" -L --max-time 20 "$url")  # GET fallback
  fi
  echo "$code  ----  $url"
}
export -f check
export UA
node -e 'const r=JSON.parse(require("fs").readFileSync("/tmp/verify.json","utf8"));r.urls.forEach(u=>console.log(u))' \
  | xargs -P 8 -I{} bash -c 'check "$@"' _ {}
