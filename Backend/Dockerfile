# Use Python 3.10 slim means lighter version or image project to run 
FROM python:3.12-slim 

# Python settings for dbugging purpose and 2nd is stopping unnecessay file 
ENV PYTHONUNBUFFERED=1  
ENV PYTHONDONTWRITEBYTECODE=1

# Working directory inside container
WORKDIR /app

# Install MySQL build dependencies 
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/* 

# Copy requirements first 
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project means source file and put it in distination
COPY . .

# Django port is 8000 this port will be opened in our local machine
EXPOSE 8000

# Start Django after gunicorn -production server & resumebackend that is project name we have to add 
CMD ["gunicorn", "resumebackend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "180"] 