FROM ubuntu:20.04

# Create non-root user.
# 
# For now handled by .devcontainer.json features,
# however this may be later uncommented to achieve vscode
# indpendendent container.
#  
# https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user#_creating-a-nonroot-user
# ARG USERNAME=vscode
# ARG USER_UID=1000
# ARG USER_GID=$USER_UID
# RUN groupadd --gid $USER_GID $USERNAME \
#     && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
#     # [Optional] Add sudo support. Omit if you don't need to install software after connecting.
#     && apt-get update \
#     && apt-get install -y sudo \
#     && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
#     && chmod 0440 /etc/sudoers.d/$USERNAME

# Install 

# prevents promts like asking timezone while installing npm
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Prague

# Install additional OS packages.
# - ca-certificates: resi error pri pouzivani curl "curl: (77) error setting certificate verify locations:"
# - python3-pip: for aws sam lint extension
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl ca-certificates zip unzip python3-pip

# Install nodejs&npm&npx&typescript
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
# Install global node packages
RUN npm install -g typescript eslint

# Switch to created user
# USER $USERNAME
