#!/bin/bash

# 配置信息 - 請替換為您的 Docker Hub 用戶名
DOCKER_USERNAME="您的用戶名"
IMAGE_NAME="aquarium-monitor"
VERSION="v1.0"

# 登入 Docker Hub (可能需要手動輸入密碼)
echo "登入 Docker Hub..."
docker login

# 構建 Docker 映像
echo "構建 Docker 映像..."
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$VERSION .

# 標記為 latest
echo "標記為 latest 版本..."
docker tag $DOCKER_USERNAME/$IMAGE_NAME:$VERSION $DOCKER_USERNAME/$IMAGE_NAME:latest

# 推送到 Docker Hub
echo "推送 Docker 映像到 Docker Hub..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION
docker push $DOCKER_USERNAME/$IMAGE_NAME:latest

echo "完成! 映像已上傳到 Docker Hub"