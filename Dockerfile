# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy csproj and restore
COPY Web/*.csproj ./Web/
RUN dotnet restore Web/Web.csproj

# Copy everything else and build
COPY . ./
RUN dotnet publish Web/Web.csproj -c Release -o out

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Web.dll"]
