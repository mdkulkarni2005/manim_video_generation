FROM codercom/code-server:latest

# Install Python and pip
RUN sudo apt-get update \
    && sudo apt-get install -y python3 python3-pip python3-venv \
    && sudo apt-get install -y ffmpeg \
    && sudo apt-get clean

# Create a virtual environment
RUN mkdir -p /home/coder/venv \
    && python3 -m venv /home/coder/venv \
    && /home/coder/venv/bin/pip install --upgrade pip

ENV PATH="/home/coder/venv/bin:$PATH"

# Set the working directory
WORKDIR /home/coder/project

# Expose code-server port
EXPOSE 8080

# Start code-server (CMD inherited from base image)
