FROM node:24-bookworm-slim

# 集成测试仅使用临时容器的 Nginx、GNU 工具和自签证书，不安装应用依赖。
RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx curl openssl util-linux ca-certificates gzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
CMD ["node", "deploy/tests/run-integration.mjs"]
