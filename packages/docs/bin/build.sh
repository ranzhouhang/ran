#!/bin/bash 

bin=./node_modules/.bin

$bin/vitepress build
# 开启调试模式
set -x
# 指定目录  
dir="./.vitepress/dist"
# 使用find命令将文件路径输出到一个临时文件  
tmpfile=$(mktemp)
find "$dir" -type f > "$tmpfile"
cat $tmpfile
# 从临时文件中读取文件路径并存储到数组中  
while read -r file; do
    file_paths+=("$file")
done < "$tmpfile"
# 删除临时文件
rm "$tmpfile"
# 关闭调试模式
set +x
# 临时缓存文件
output="./.vitepress/dist/sw-file.js"
# 生成的目标文件
target="./.vitepress/dist/sw.js"
# 拼接字符串
echo "const serviceWorkCacheFilePaths = [" > "$output"
# 根路径
ran="/ran"
# 打印数组中的文件路径  
for path in "${file_paths[@]}"; do
    if [[ $path != *".DS_Store"* ]]; then
        str="${path##./.vitepress/dist}"
        echo "\"$ran$str\"," >> "$output"
    fi
done
# 拼接字符串
echo "];" >> "$output"

tmpfile=$(mktemp)

cat "$output" >> "$tmpfile"

cat "$target" >> "$tmpfile"

mv "$tmpfile" "$target"

rm "$output"
# 打印完成消息  
echo "service work file paths have been generate for $target"