# Build context: monorepo root
# Railway setting → Root Directory: (blank), Dockerfile Path: apps/builder/Dockerfile

FROM node:22-slim
WORKDIR /app

# Install builder deps
COPY apps/builder/package.json ./
RUN npm install

# Copy builder source
COPY apps/builder/src/ ./src/
COPY apps/builder/tsconfig.json ./

# Shared copy rules read by src/qa.ts and the generation prompt
COPY config/banned-phrases.json ./config/banned-phrases.json

# Copy client-site template (the builder reads these at runtime to upload to Vercel)
COPY apps/client-site/ ./template/

CMD ["npx", "tsx", "src/index.ts"]
